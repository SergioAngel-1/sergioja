import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

// GET /api/admin/redirects - Listar todas las redirecciones agrupadas por proyecto
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const redirects = await prisma.slugRedirect.findMany({
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
  });

  const deletedRedirects: any[] = [];
  const groupedByProject = redirects.reduce((acc: any, redirect: any) => {
    const isDeletedRedirect = redirect.newSlug === 'projects';

    if (isDeletedRedirect) {
      deletedRedirects.push({
        id: redirect.id,
        oldSlug: redirect.oldSlug,
        newSlug: redirect.newSlug,
        createdAt: redirect.createdAt,
        project: redirect.project,
        redirectType: 'DELETED_PROJECT',
      });
      return acc;
    }

    const projectId = redirect.project.id;
    
    if (!acc[projectId]) {
      acc[projectId] = {
        project: redirect.project,
        redirects: [],
        count: 0,
      };
    }
    
    acc[projectId].redirects.push({
      id: redirect.id,
      oldSlug: redirect.oldSlug,
      newSlug: redirect.newSlug,
      createdAt: redirect.createdAt,
      redirectType: 'STANDARD',
    });
    acc[projectId].count++;
    
    return acc;
  }, {});

  const groupedArray = Object.values(groupedByProject).sort((a: any, b: any) => b.count - a.count);

  logger.info('Redirects fetched', { 
    totalRedirects: redirects.length,
    projectsAffected: groupedArray.length,
    deletedRedirects: deletedRedirects.length,
  });

  return res.json({
    success: true,
    data: {
      grouped: groupedArray,
      deleted: deletedRedirects,
      total: redirects.length,
      projectsAffected: groupedArray.length,
      deletedCount: deletedRedirects.length,
    },
  });
}));

// DELETE /api/admin/redirects/:id - Eliminar redirección
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
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

export default router;
