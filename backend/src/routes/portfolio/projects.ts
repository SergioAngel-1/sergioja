import { Router, Request, Response } from 'express';
import { ApiResponse, Project, PaginatedResponse } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { asyncHandler } from '../../middleware/errorHandler';
import { getProjectCacheVersion } from '../../lib/cacheVersion';
import { categoryCache } from '../../lib/categoryCache';

const router = Router();

// GET /api/projects/cache/version - Obtener versión de caché de proyectos
router.get('/cache/version', asyncHandler(async (_req: Request, res: Response) => {
  const version = getProjectCacheVersion();
  const response: ApiResponse<{ version: number }> = {
    success: true,
    data: { version },
    timestamp: new Date().toISOString(),
  };
  res.json(response);
}));

// GET /api/projects/list - Lightweight list for cards (excludes longDescription*, imagesDesktop, imagesMobile, tech icons SVG)
router.get('/list', asyncHandler(async (req: Request, res: Response) => {
  const { tech, category, featured, page = '1', limit = '50' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = Math.min(parseInt(limit as string, 10), 100); // Cap at 100

  const where: any = { status: { in: ['PUBLISHED', 'IN_PROGRESS'] } };

  if (category && typeof category === 'string') {
    where.categories = { has: category };
  }

  if (featured === 'true') {
    where.isFeatured = true;
  }

  if (tech && typeof tech === 'string') {
    where.technologies = {
      some: {
        technology: {
          name: { contains: tech, mode: 'insensitive' },
        },
      },
    };
  }

  const total = await prisma.project.count({ where });

  if (total === 0) {
    return res.json({
      success: true,
      data: {
        data: [],
        pagination: { page: pageNum, limit: limitNum, total: 0, totalPages: 0 },
      },
      timestamp: new Date().toISOString(),
    });
  }

  const projects = await prisma.project.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      // Excluir: longDescriptionEs, longDescriptionEn (pesados, solo se truncan en card)
      // Incluir un excerpt calculado sería ideal, pero Prisma no soporta computed fields
      // Solución: traer solo los primeros 200 chars sería con raw query; por ahora excluimos
      thumbnailImage: true,
      // Excluir: imagesDesktop, imagesMobile (no se usan en cards)
      categories: true,
      status: true,
      isFeatured: true,
      displayOrder: true,
      demoUrl: true,
      repoUrl: true,
      githubUrl: true,
      isCodePublic: true,
      performanceScore: true,
      accessibilityScore: true,
      seoScore: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      technologies: {
        select: {
          category: true,
          proficiency: true,
          yearsOfExperience: true,
          technology: {
            select: {
              name: true,
              // Excluir: icon (SVG completo, pesado para lista)
              color: true,
            },
          },
        },
      },
    },
    orderBy: [
      { displayOrder: { sort: 'asc', nulls: 'last' } },
      { publishedAt: 'desc' },
      { updatedAt: 'desc' }
    ],
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  });

  const categoryLabelsMap = await categoryCache.getProjectCategoryLabels();

  const transformedProjects = projects.map((p: any) => {
    const projectCategoryLabels: Record<string, string> = {};
    if (p.categories) {
      p.categories.forEach((cat: string) => {
        if (categoryLabelsMap[cat]) {
          projectCategoryLabels[cat] = categoryLabelsMap[cat];
        }
      });
    }

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      thumbnailImage: p.thumbnailImage || null,
      categories: p.categories || [],
      categoryLabels: projectCategoryLabels,
      status: p.status,
      isFeatured: p.isFeatured,
      demoUrl: p.demoUrl || undefined,
      repoUrl: p.repoUrl || undefined,
      githubUrl: p.githubUrl || p.repoUrl || undefined,
      isCodePublic: p.isCodePublic,
      performanceScore: p.performanceScore || null,
      accessibilityScore: p.accessibilityScore || null,
      seoScore: p.seoScore || null,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      technologies: p.technologies?.map((pt: any) => ({
        name: pt.technology?.name,
        category: pt.category,
        proficiency: pt.proficiency,
        yearsOfExperience: pt.yearsOfExperience,
        color: pt.technology?.color ?? undefined,
      })).filter((t: any) => !!t.name) || [],
    };
  });

  res.json({
    success: true,
    data: {
      data: transformedProjects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
    timestamp: new Date().toISOString(),
    cacheVersion: getProjectCacheVersion(),
  });
}));

// GET /api/projects - Get all published projects with filtering and pagination
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { tech, category, featured, page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  // Build where clause - Solo proyectos publicados
  const where: any = { status: { in: ['PUBLISHED', 'IN_PROGRESS'] } };

  if (category && typeof category === 'string') {
    where.categories = {
      has: category,
    };
  }

  if (featured === 'true') {
    where.isFeatured = true;
  }

  if (tech && typeof tech === 'string') {
    where.technologies = {
      some: {
        technology: {
          name: {
            contains: tech,
            mode: 'insensitive',
          },
        },
      },
    };
  }

  // Get total count
  const total = await prisma.project.count({ where });

  // If no projects, return empty payload gracefully
  if (total === 0) {
    const emptyResponse: ApiResponse<PaginatedResponse<Project>> = {
      success: true,
      data: {
        data: [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          totalPages: 0,
        },
      },
      timestamp: new Date().toISOString(),
    };
    return res.json(emptyResponse);
  }

    // Get paginated projects with technologies
    const projects = await prisma.project.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        longDescriptionEs: true,
        longDescriptionEn: true,
        thumbnailImage: true,
        imagesDesktop: true,
        imagesMobile: true,
        categories: true,
        status: true,
        isFeatured: true,
        displayOrder: true,
        demoUrl: true,
        repoUrl: true,
        githubUrl: true,
        isCodePublic: true,
        performanceScore: true,
        accessibilityScore: true,
        seoScore: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        technologies: {
          select: {
            category: true,
            proficiency: true,
            yearsOfExperience: true,
            technology: {
              select: {
                name: true,
                icon: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: [
        { displayOrder: { sort: 'asc', nulls: 'last' } },
        { publishedAt: 'desc' },
        { updatedAt: 'desc' }
      ],
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

  // Obtener labels de categorías desde caché en memoria (elimina query N+1)
  const categoryLabelsMap = await categoryCache.getProjectCategoryLabels();

  // Transform to match frontend interface
  const transformedProjects: Project[] = projects.map((p: any) => {
    // Crear categoryLabels específico para este proyecto
    const projectCategoryLabels: Record<string, string> = {};
    if (p.categories) {
      p.categories.forEach((cat: string) => {
        if (categoryLabelsMap[cat]) {
          projectCategoryLabels[cat] = categoryLabelsMap[cat];
        }
      });
    }

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      longDescriptionEs: p.longDescriptionEs ?? null,
      longDescriptionEn: p.longDescriptionEn ?? null,
      thumbnailImage: p.thumbnailImage || null,
      imagesDesktop: p.imagesDesktop || [],
      imagesMobile: p.imagesMobile || [],
      categories: p.categories || [],
      categoryLabels: projectCategoryLabels, // Agregar labels de categorías
      status: p.status,
      isFeatured: p.isFeatured,
      demoUrl: p.demoUrl || undefined,
      repoUrl: p.repoUrl || undefined,
      githubUrl: p.githubUrl || p.repoUrl || undefined,
      isCodePublic: p.isCodePublic,
      performanceScore: p.performanceScore || null,
      accessibilityScore: p.accessibilityScore || null,
      seoScore: p.seoScore || null,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      technologies: p.technologies?.map((pt: any) => ({
        name: pt.technology?.name,
        category: pt.category,
        proficiency: pt.proficiency,
        yearsOfExperience: pt.yearsOfExperience,
        icon: pt.technology?.icon ?? undefined,
        color: pt.technology?.color ?? undefined,
      })).filter((t: any) => !!t.name) || [],
    };
  });

  const response: ApiResponse<PaginatedResponse<Project>> = {
    success: true,
    data: {
      data: transformedProjects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
    timestamp: new Date().toISOString(),
    cacheVersion: getProjectCacheVersion(),
  };

  res.json(response);
}));

// GET /api/projects/:slug - Get project by slug
router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

    const project = await prisma.project.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        longDescriptionEs: true,
        longDescriptionEn: true,
        thumbnailImage: true,
        imagesDesktop: true,
        imagesMobile: true,
        categories: true,
        status: true,
        isFeatured: true,
        displayOrder: true,
        demoUrl: true,
        repoUrl: true,
        githubUrl: true,
        isCodePublic: true,
        performanceScore: true,
        accessibilityScore: true,
        seoScore: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        technologies: {
          select: {
            category: true,
            proficiency: true,
            yearsOfExperience: true,
            technology: {
              select: {
                name: true,
                icon: true,
                color: true,
              },
            },
          },
        },
      },
    });

  if (!project || project.status === 'DRAFT') {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Project not found',
        code: 'PROJECT_NOT_FOUND',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Obtener labels de categorías desde caché en memoria (elimina query N+1)
  const categoryLabelsMap = await categoryCache.getProjectCategoryLabels();
  const categoryLabels: Record<string, string> = {};
  if (project.categories && project.categories.length > 0) {
    project.categories.forEach((cat: string) => {
      if (categoryLabelsMap[cat]) {
        categoryLabels[cat] = categoryLabelsMap[cat];
      }
    });
  }

  // Transform to match frontend interface
  const transformedProject: Project = {
    id: project.id,
    slug: project.slug,
    title: project.title,
    longDescriptionEs: project.longDescriptionEs ?? null,
    longDescriptionEn: project.longDescriptionEn ?? null,
    thumbnailImage: project.thumbnailImage || null,
    imagesDesktop: project.imagesDesktop || [],
    imagesMobile: project.imagesMobile || [],
    categories: project.categories || [],
    categoryLabels: categoryLabels, // Agregar labels de categorías
    status: project.status,
    isFeatured: project.isFeatured,
    demoUrl: project.demoUrl || undefined,
    repoUrl: project.repoUrl || undefined,
    githubUrl: project.githubUrl || project.repoUrl || undefined,
    isCodePublic: project.isCodePublic,
    performanceScore: project.performanceScore || null,
    accessibilityScore: project.accessibilityScore || null,
    seoScore: project.seoScore || null,
    publishedAt: project.publishedAt ? project.publishedAt.toISOString() : null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    technologies: project.technologies?.map((pt: any) => ({
      name: pt.technology?.name,
      category: pt.category,
      proficiency: pt.proficiency,
      yearsOfExperience: pt.yearsOfExperience,
      icon: pt.technology?.icon ?? undefined,
      color: pt.technology?.color ?? undefined,
    })).filter((t: any) => !!t.name) || [],
  };

  const response: ApiResponse<Project> = {
    success: true,
    data: transformedProject,
    timestamp: new Date().toISOString(),
    cacheVersion: getProjectCacheVersion(),
  };

  res.json(response);
}));

export default router;
