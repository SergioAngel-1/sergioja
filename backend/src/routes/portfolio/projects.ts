import { Router, Request, Response } from 'express';
import { ApiResponse, Project, PaginatedResponse } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

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
    include: {
      technologies: {
        include: {
          technology: true,
        },
      },
    },
    orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  });

  // Transform to match frontend interface
  const transformedProjects: Project[] = projects.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    longDescriptionEs: p.longDescriptionEs ?? null,
    longDescriptionEn: p.longDescriptionEn ?? null,
    images: p.images || [],
    categories: p.categories || [],
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
  }));

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
  };

  res.json(response);
}));

// GET /api/projects/:slug - Get single published project by slug
router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      technologies: {
        include: {
          technology: true,
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

  // Transform to match frontend interface
  const transformedProject: Project = {
    id: project.id,
    slug: project.slug,
    title: project.title,
    longDescriptionEs: project.longDescriptionEs ?? null,
    longDescriptionEn: project.longDescriptionEn ?? null,
    images: project.images || [],
    categories: project.categories || [],
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
  };

  res.json(response);
}));

export default router;
