import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { asyncHandler } from '../../middleware/errorHandler';
import { authMiddleware } from '../../middleware/auth';
import { validateSlug } from '../../lib/slugHelpers';

const router = Router();

// GET /api/admin/redirects - Listar todas las redirecciones agrupadas por proyecto
router.get('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', limit = '100', projectId } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // Validar parámetros
  if (pageNum < 1 || limitNum < 1 || limitNum > 500) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PAGINATION',
        message: 'Parámetros de paginación inválidos (page >= 1, limit 1-500)',
      },
    });
  }

  // Construir filtro
  const where = projectId ? { projectId: projectId as string } : {};

  // Obtener total y redirects en paralelo
  const [total, redirects] = await Promise.all([
    prisma.slugRedirect.count({ where }),
    prisma.slugRedirect.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limitNum,
      skip,
    }),
  ]);

  const deletedRedirects: any[] = [];
  const customRedirects: any[] = [];
  const groupedByProject = redirects.reduce((acc: any, redirect: any) => {
    const isDeletedRedirect = redirect.newSlug === 'projects';

    if (isDeletedRedirect) {
      deletedRedirects.push({
        id: redirect.id,
        oldSlug: redirect.oldSlug,
        newSlug: redirect.newSlug,
        createdAt: redirect.createdAt,
        notes: redirect.notes,
        project: redirect.project,
        redirectType: 'DELETED_PROJECT',
      });
      return acc;
    }

    const projectIdKey = redirect.project?.id;
    
    // Custom redirects (without projectId)
    if (!projectIdKey) {
      customRedirects.push({
        id: redirect.id,
        oldSlug: redirect.oldSlug,
        newSlug: redirect.newSlug,
        notes: redirect.notes,
        createdAt: redirect.createdAt,
        redirectType: 'CUSTOM',
      });
      return acc;
    }
    
    if (!acc[projectIdKey]) {
      acc[projectIdKey] = {
        project: redirect.project,
        redirects: [],
        count: 0,
      };
    }
    
    acc[projectIdKey].redirects.push({
      id: redirect.id,
      oldSlug: redirect.oldSlug,
      newSlug: redirect.newSlug,
      notes: redirect.notes,
      createdAt: redirect.createdAt,
      redirectType: 'STANDARD',
    });
    acc[projectIdKey].count++;
    
    return acc;
  }, {});

  const groupedArray = Object.values(groupedByProject).sort((a: any, b: any) => b.count - a.count);

  logger.info('Redirects fetched', { 
    page: pageNum,
    limit: limitNum,
    total,
    returned: redirects.length,
    projectsAffected: groupedArray.length,
    deletedRedirects: deletedRedirects.length,
  });

  return res.json({
    success: true,
    data: {
      grouped: groupedArray,
      custom: customRedirects,
      customCount: customRedirects.length,
      deleted: deletedRedirects,
      deletedCount: deletedRedirects.length,
      total,
      projectsAffected: groupedArray.length,
    },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: skip + redirects.length < total,
      hasPreviousPage: pageNum > 1,
    },
  });
}));

// DELETE /api/admin/redirects/:id - Eliminar redirección
router.delete('/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const redirect = await prisma.slugRedirect.findUnique({
    where: { id },
  });

  if (!redirect) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Redirección no encontrada',
      },
    });
  }

  await prisma.slugRedirect.delete({
    where: { id },
  });

  logger.info('Redirect deleted', { id, oldSlug: redirect.oldSlug });

  return res.json({
    success: true,
    message: 'Redirección eliminada correctamente',
  });
}));

// POST /api/admin/redirects - Crear redirección manual
router.post('/', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { oldSlug, newSlug, notes } = req.body;

  // Validar campos requeridos
  if (!oldSlug || !newSlug) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Los campos oldSlug y newSlug son requeridos',
      },
    });
  }

  // Limpiar y normalizar slugs
  const cleanOldSlug = oldSlug.trim().replace(/^\/+/, '');
  const cleanNewSlug = newSlug.trim();

  // Validar formato de slugs
  try {
    validateSlug(cleanOldSlug);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_OLD_SLUG',
        message: error instanceof Error ? error.message : 'El slug de origen no es válido',
      },
    });
  }

  // Validar que no sea auto-referencia
  if (cleanOldSlug === cleanNewSlug) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'SELF_REFERENCE',
        message: 'Una redirección no puede apuntar a sí misma',
      },
    });
  }

  // Verificar que oldSlug no exista ya
  const existingRedirect = await prisma.slugRedirect.findUnique({
    where: { oldSlug: cleanOldSlug },
  });

  if (existingRedirect) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'REDIRECT_EXISTS',
        message: `Ya existe una redirección para "${cleanOldSlug}"`,
      },
    });
  }

  // Verificar que oldSlug no sea un proyecto activo
  const existingProject = await prisma.project.findUnique({
    where: { slug: cleanOldSlug },
    select: { id: true, title: true },
  });

  if (existingProject) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'SLUG_IS_ACTIVE_PROJECT',
        message: `"${cleanOldSlug}" es un proyecto activo (${existingProject.title}). No puedes crear una redirección para un slug activo.`,
      },
    });
  }

  // Crear redirección manual (sin projectId)
  const redirect = await prisma.slugRedirect.create({
    data: {
      oldSlug: cleanOldSlug,
      newSlug: cleanNewSlug,
      notes: notes?.trim() || null,
      projectId: null,
    },
  });

  logger.info('Manual redirect created', { 
    oldSlug: cleanOldSlug, 
    newSlug: cleanNewSlug,
    hasNotes: !!notes,
  });

  return res.status(201).json({
    success: true,
    data: redirect,
    message: 'Redirección manual creada correctamente',
  });
}));

export default router;
