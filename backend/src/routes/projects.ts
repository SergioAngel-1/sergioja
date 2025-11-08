import { Router, Request, Response } from 'express';
import { ApiResponse, Project, PaginatedResponse } from '../../../shared/types';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

const router = Router();

// GET /api/projects - Get all projects with filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tech, category, featured, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Build where clause
    const where: any = { publishedAt: { not: null } };
    
    if (category && typeof category === 'string') {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
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
      orderBy: { publishedAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    // Transform to match frontend interface
    const transformedProjects: Project[] = projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      longDescription: p.longDescription || undefined,
      image: p.image || undefined,
      technologies: p.technologies.map((t) => t.technology.name),
      tech: p.technologies.map((t) => t.technology.name),
      category: p.category,
      featured: p.featured,
      demoUrl: p.demoUrl || undefined,
      githubUrl: p.repoUrl || undefined,
      repoUrl: p.repoUrl || undefined,
      status: 'completed' as const,
      metrics: p.performanceScore ? {
        performance: p.performanceScore,
        accessibility: p.accessibilityScore || 0,
        seo: p.seoScore || 0,
      } : undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
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
  } catch (error) {
    logger.error('Error fetching projects', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch projects',
        code: 'INTERNAL_ERROR',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/projects/:slug - Get single project by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
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

    if (!project) {
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
      title: project.title,
      slug: project.slug,
      description: project.description,
      longDescription: project.longDescription || undefined,
      image: project.image || undefined,
      technologies: project.technologies.map((t) => t.technology.name),
      tech: project.technologies.map((t) => t.technology.name),
      category: project.category,
      featured: project.featured,
      demoUrl: project.demoUrl || undefined,
      githubUrl: project.repoUrl || undefined,
      repoUrl: project.repoUrl || undefined,
      status: 'completed' as const,
      metrics: project.performanceScore ? {
        performance: project.performanceScore,
        accessibility: project.accessibilityScore || 0,
        seo: project.seoScore || 0,
      } : undefined,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };

    const response: ApiResponse<Project> = {
      success: true,
      data: transformedProject,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    logger.error('Error fetching project', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch project',
        code: 'INTERNAL_ERROR',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
