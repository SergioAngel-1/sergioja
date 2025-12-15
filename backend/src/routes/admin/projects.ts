import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { authMiddleware } from '../../middleware/auth';
import { batchProcessTechnologies } from '../../lib/batchTechnology';
import { asyncHandler } from '../../middleware/errorHandler';
import { Prisma } from '@prisma/client';

const router = Router();

const projectStatusValues = ['DRAFT', 'IN_PROGRESS', 'PUBLISHED'] as const;
type ProjectStatus = typeof projectStatusValues[number];
const isProjectStatus = (value: unknown): value is ProjectStatus =>
  typeof value === 'string' && (projectStatusValues as readonly string[]).includes(value);

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/admin/projects - Obtener todos los proyectos (incluyendo borradores)
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { category, featured, page = '1', limit = '100' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  // Build where clause - NO filtrar por publishedAt para admin
  const where: Record<string, unknown> = {};

  if (category && typeof category === 'string') {
    where.categories = { has: category };
  }

  if (featured === 'true') {
    where.isFeatured = true;
  }

  // Get total count
  const total = await prisma.project.count({ where });

  // Get projects with technologies
  const projects = await prisma.project.findMany({
    where,
    include: {
      technologies: {
        include: {
          technology: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  });

  // Transform projects to ensure all fields are present and match Prisma schema
  const transformedProjects = projects.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    longDescriptionEs: p.longDescriptionEs ?? null,
    longDescriptionEn: p.longDescriptionEn ?? null,
    images: p.images || [],
    categories: p.categories || [],
    status: p.status,
    isFeatured: p.isFeatured,
    demoUrl: p.demoUrl,
    repoUrl: p.repoUrl,
    githubUrl: p.githubUrl || p.repoUrl,
    isCodePublic: p.isCodePublic,
    performanceScore: p.performanceScore,
    accessibilityScore: p.accessibilityScore,
    seoScore: p.seoScore,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    // Technologies para el admin (necesario para edición)
    technologies: p.technologies.map((t: any) => ({
      name: t.technology.name,
      category: t.category,
      proficiency: t.proficiency,
      yearsOfExperience: t.yearsOfExperience,
    })),
  }));

  logger.info('Admin projects retrieved', { count: transformedProjects.length, total });

  res.json({
    success: true,
    data: transformedProjects,
  });
}));

// POST /api/admin/projects - Crear nuevo proyecto
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    longDescription,
    longDescriptionEs,
    longDescriptionEn,
    category,
    categories,
    technologies,
    technologiesData,
    featured,
    isFeatured,
    status,
    repoUrl,
    demoUrl,
    images,
    isCodePublic,
    publishedAt,
    performanceScore,
    accessibilityScore,
    seoScore,
  } = req.body;

  // Validaciones básicas
  if (!title) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Título es requerido',
      },
    });
  }

  const resolvedLongDescriptionEs = (longDescriptionEs ?? longDescription) ?? null;
  const resolvedLongDescriptionEn = longDescriptionEn ?? null;

  if (!resolvedLongDescriptionEs && !resolvedLongDescriptionEn) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Debes proporcionar una descripción detallada (ES y/o EN)',
      },
    });
  }

  // Crear slug desde el título
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Verificar si el slug ya existe y agregar sufijo si es necesario
  let slugExists = await prisma.project.findUnique({ where: { slug } });
  let counter = 1;
  const baseSlug = slug;

  while (slugExists) {
    slug = `${baseSlug}-${counter}`;
    slugExists = await prisma.project.findUnique({ where: { slug } });
    counter++;
  }

  // Determinar categorías (soportar ambos formatos)
  let projectCategories: string[] = [];
  if (categories && Array.isArray(categories)) {
    projectCategories = categories;
  } else if (category) {
    projectCategories = [category];
  } else {
    projectCategories = ['web'];
  }

  // Crear proyecto
  const resolvedStatus: ProjectStatus = isProjectStatus(status)
    ? status
    : (publishedAt ? 'PUBLISHED' : 'DRAFT');

  const resolvedPublishedAt = resolvedStatus === 'PUBLISHED'
    ? (publishedAt ? new Date(publishedAt) : new Date())
    : null;

  const project = await prisma.project.create({
    data: {
      title,
      slug,
      longDescriptionEs: resolvedLongDescriptionEs,
      longDescriptionEn: resolvedLongDescriptionEn,
      categories: projectCategories,
      status: resolvedStatus,
      isFeatured: (isFeatured !== undefined ? isFeatured : featured) || false,
      repoUrl: repoUrl || null,
      demoUrl: demoUrl || null,
      images: Array.isArray(images) ? images : [],
      isCodePublic: isCodePublic !== undefined ? isCodePublic : true,
      publishedAt: resolvedPublishedAt,
      performanceScore: performanceScore ?? null,
      accessibilityScore: accessibilityScore ?? null,
      seoScore: seoScore ?? null,
    },
  });

  // Agregar tecnologías - OPTIMIZADO: Batch operations (30+ queries → 3-5)
  if (technologiesData && Array.isArray(technologiesData) && technologiesData.length > 0) {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await batchProcessTechnologies(tx, project.id, technologiesData);
    });
  } else if (technologies && Array.isArray(technologies) && technologies.length > 0) {
    // Soporte legacy: solo nombres de tecnologías
    for (const techName of technologies) {
      let technology = await prisma.technology.findUnique({
        where: { name: techName },
      });

      if (!technology) {
        technology = await prisma.technology.create({
          data: {
            name: techName,
            category: 'other',
            color: '#FF0000',
          },
        });
      }

      await prisma.projectTechnology.create({
        data: {
          projectId: project.id,
          technologyId: technology.id,
          category: 'other',
          proficiency: 50,
          yearsOfExperience: 0,
        },
      });
    }
  }

  // Obtener el proyecto con todas sus relaciones para devolverlo
  const projectWithRelations = await prisma.project.findUnique({
    where: { id: project.id },
    include: {
      technologies: {
        include: {
          technology: true,
        },
      },
    },
  });

  // Transformar para aplanar la estructura de tecnologías
  const transformedProject = {
    ...projectWithRelations,
    technologies: projectWithRelations?.technologies.map((pt: any) => ({
      name: pt.technology.name,
      category: pt.category,
      proficiency: pt.proficiency,
      yearsOfExperience: pt.yearsOfExperience,
    })) || [],
  };

  logger.info('Project created', { id: project.id, title: project.title });

  res.status(201).json({
    success: true,
    data: transformedProject,
  });
}));

// PUT /api/admin/projects/:slug - Actualizar proyecto
router.put('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const {
    title,
    longDescription,
    longDescriptionEs,
    longDescriptionEn,
    category,
    categories,
    technologies,
    technologiesData,
    featured,
    isFeatured,
    status,
    repoUrl,
    demoUrl,
    images,
    isCodePublic,
    publishedAt,
    performanceScore,
    accessibilityScore,
    seoScore,
  } = req.body;

  // Verificar que el proyecto existe
  const existingProject = await prisma.project.findUnique({
    where: { slug },
  });

  if (!existingProject) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Proyecto no encontrado',
      },
    });
  }

  // Determinar categorías (soportar ambos formatos)
  let projectCategories: string[] | undefined;
  if (categories && Array.isArray(categories)) {
    projectCategories = categories;
  } else if (category) {
    projectCategories = [category];
  }

  // Actualizar proyecto
  const resolvedStatus: ProjectStatus = isProjectStatus(status)
    ? status
    : (publishedAt ? 'PUBLISHED' : existingProject.status);

  const resolvedPublishedAt = resolvedStatus === 'PUBLISHED'
    ? (publishedAt !== undefined
      ? (publishedAt ? new Date(publishedAt) : new Date())
      : (existingProject.publishedAt || new Date()))
    : null;

  const project = await prisma.project.update({
    where: { slug },
    data: {
      title: title || existingProject.title,
      longDescriptionEs:
        longDescriptionEs !== undefined
          ? longDescriptionEs
          : longDescription !== undefined
            ? longDescription
            : existingProject.longDescriptionEs,
      longDescriptionEn:
        longDescriptionEn !== undefined ? longDescriptionEn : existingProject.longDescriptionEn,
      categories: projectCategories !== undefined ? projectCategories : existingProject.categories,
      status: resolvedStatus,
      isFeatured: isFeatured !== undefined ? isFeatured : (featured !== undefined ? featured : existingProject.isFeatured),
      repoUrl: repoUrl !== undefined ? repoUrl : existingProject.repoUrl,
      demoUrl: demoUrl !== undefined ? demoUrl : existingProject.demoUrl,
      images: images !== undefined ? (Array.isArray(images) ? images : []) : existingProject.images,
      isCodePublic: isCodePublic !== undefined ? isCodePublic : existingProject.isCodePublic,
      publishedAt: resolvedPublishedAt,
      performanceScore: performanceScore !== undefined ? performanceScore : existingProject.performanceScore,
      accessibilityScore: accessibilityScore !== undefined ? accessibilityScore : existingProject.accessibilityScore,
      seoScore: seoScore !== undefined ? seoScore : existingProject.seoScore,
    },
  });

  // Actualizar tecnologías - OPTIMIZADO: Batch operations
  if (technologiesData && Array.isArray(technologiesData)) {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Primero eliminar relaciones existentes
      await tx.projectTechnology.deleteMany({
        where: { projectId: project.id },
      });

      // Luego agregar nuevas en batch
      await batchProcessTechnologies(tx, project.id, technologiesData);
    });
  } else if (technologies && Array.isArray(technologies)) {
    // Soporte legacy: solo nombres
    await prisma.projectTechnology.deleteMany({
      where: { projectId: project.id },
    });

    for (const techName of technologies) {
      let technology = await prisma.technology.findUnique({
        where: { name: techName },
      });

      if (!technology) {
        technology = await prisma.technology.create({
          data: {
            name: techName,
            category: 'other',
            color: '#FF0000',
          },
        });
      }

      await prisma.projectTechnology.create({
        data: {
          projectId: project.id,
          technologyId: technology.id,
          category: 'other',
          proficiency: 50,
          yearsOfExperience: 0,
        },
      });
    }
  }

  // Obtener el proyecto actualizado con sus relaciones
  const updatedProjectWithRelations = await prisma.project.findUnique({
    where: { id: project.id },
    include: {
      technologies: {
        include: {
          technology: true,
        },
      },
    },
  });

  // Transformar para aplanar la estructura de tecnologías
  const transformedProject = {
    ...updatedProjectWithRelations,
    technologies: updatedProjectWithRelations?.technologies.map((pt: any) => ({
      name: pt.technology.name,
      category: pt.category,
      proficiency: pt.proficiency,
      yearsOfExperience: pt.yearsOfExperience,
    })) || [],
  };

  logger.info('Project updated', { id: project.id, slug: project.slug });

  res.json({
    success: true,
    data: transformedProject,
  });
}));

// DELETE /api/admin/projects/:slug - Eliminar proyecto
router.delete('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  // Verificar que el proyecto existe
  const existingProject = await prisma.project.findUnique({
    where: { slug },
  });

  if (!existingProject) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Proyecto no encontrado',
      },
    });
  }

  // Usar transacción para garantizar atomicidad
  await prisma.$transaction([
    prisma.projectTechnology.deleteMany({
      where: { projectId: existingProject.id },
    }),
    prisma.project.delete({
      where: { slug },
    }),
  ]);

  logger.info('Project deleted', { slug });

  res.json({
    success: true,
    data: { slug },
  });
}));

export default router;
