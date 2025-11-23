import { Router, Request, Response } from 'express';
import { ApiResponse, Skill, Project } from '../../../shared/types';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

const router = Router();

// GET /api/skills - Get all skills
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const where: any = {};
    if (category && typeof category === 'string') {
      where.category = category;
    }

    const technologies = await prisma.technology.findMany({
      where,
      orderBy: { proficiency: 'desc' },
    });

    const skills: Skill[] = technologies.map((t: any) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      proficiency: t.proficiency,
      yearsOfExperience: t.yearsOfExperience,
      icon: t.icon || undefined,
      color: t.color,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    const response: ApiResponse<Skill[]> = {
      success: true,
      data: skills,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    logger.error('Error fetching skills', error);
    const response: ApiResponse<Skill[]> = {
      success: true,
      data: [],
      message: 'No skills available',
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  }
});

// GET /api/skills/:id/projects - Get projects related to a skill
router.get('/:id/projects', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const technology = await prisma.technology.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            project: {
              include: {
                technologies: {
                  include: {
                    technology: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!technology) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Skill not found',
          code: 'SKILL_NOT_FOUND',
        },
        timestamp: new Date().toISOString(),
      });
    }

    const projects: Project[] = technology.projects.map((pt: any) => ({
      id: pt.project.id,
      title: pt.project.title,
      slug: pt.project.slug,
      description: pt.project.description,
      longDescription: pt.project.longDescription || undefined,
      image: pt.project.image || undefined,
      technologies: pt.project.technologies.map((t: any) => t.technology.name),
      tech: pt.project.technologies.map((t: any) => t.technology.name),
      category: pt.project.category,
      featured: pt.project.featured,
      demoUrl: pt.project.demoUrl || undefined,
      repoUrl: pt.project.repoUrl || undefined,
      status: 'completed' as const,
      metrics: pt.project.performanceScore ? {
        performance: pt.project.performanceScore,
        accessibility: pt.project.accessibilityScore || 0,
        seo: pt.project.seoScore || 0,
      } : undefined,
      createdAt: pt.project.createdAt.toISOString(),
      updatedAt: pt.project.updatedAt.toISOString(),
    }));

    const response: ApiResponse<Project[]> = {
      success: true,
      data: projects,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    logger.error('Error fetching skill projects', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch skill projects',
        code: 'INTERNAL_ERROR',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
