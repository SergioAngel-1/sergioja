import { Router, Request, Response } from 'express';
import { ApiResponse, Skill, Project } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

// GET /api/skills - Get all skills
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;

  const where: any = {};
  if (category && typeof category === 'string') {
    where.category = category;
  }

    const technologies = await prisma.technology.findMany({
      where,
      select: {
        id: true,
        name: true,
        category: true,
        proficiency: true,
        yearsOfExperience: true,
        icon: true,
        color: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          select: {
            project: {
              select: {
                id: true,
                slug: true,
                title: true,
              },
            },
          },
        },
      },
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
    projects: t.projects?.map((pt: any) => ({
      id: pt.project.id,
      slug: pt.project.slug,
      title: pt.project.title,
    })) || [],
  }));

  const response: ApiResponse<Skill[]> = {
    success: true,
    data: skills,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// GET /api/skills/:id/projects - Get projects related to a skill
router.get('/:id/projects', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
    
    const technology = await prisma.technology.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        projects: {
          select: {
            project: {
              select: {
                id: true,
                slug: true,
                title: true,
                longDescriptionEs: true,
                longDescriptionEn: true,
                images: true,
                categories: true,
                status: true,
                isFeatured: true,
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

  const projects: Project[] = technology.projects
    .filter((pt: any) => pt.project?.status !== 'DRAFT')
    .map((pt: any) => ({
      id: pt.project.id,
      slug: pt.project.slug,
      title: pt.project.title,
      longDescriptionEs: pt.project.longDescriptionEs ?? null,
      longDescriptionEn: pt.project.longDescriptionEn ?? null,
      image: (pt.project.images && pt.project.images.length > 0) ? pt.project.images[0] : undefined,
      categories: pt.project.categories || [],
      status: pt.project.status,
      isFeatured: pt.project.isFeatured,
      demoUrl: pt.project.demoUrl || undefined,
      repoUrl: pt.project.repoUrl || undefined,
      githubUrl: pt.project.githubUrl || pt.project.repoUrl || undefined,
      isCodePublic: pt.project.isCodePublic,
      performanceScore: pt.project.performanceScore || null,
      accessibilityScore: pt.project.accessibilityScore || null,
      seoScore: pt.project.seoScore || null,
      publishedAt: pt.project.publishedAt ? pt.project.publishedAt.toISOString() : null,
      createdAt: pt.project.createdAt.toISOString(),
      updatedAt: pt.project.updatedAt.toISOString(),
      technologies: pt.project.technologies?.map((ptech: any) => ({
        name: ptech.technology?.name,
        category: ptech.category,
        proficiency: ptech.proficiency,
        yearsOfExperience: ptech.yearsOfExperience,
        icon: ptech.technology?.icon ?? undefined,
        color: ptech.technology?.color ?? undefined,
      })).filter((t: any) => !!t.name) || [],
    }));

  const response: ApiResponse<Project[]> = {
    success: true,
    data: projects,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// PUT /api/skills/:id - Update a skill
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category, proficiency, yearsOfExperience, color, icon } = req.body;

  const technology = await prisma.technology.findUnique({
    where: { id },
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

  const updatedTechnology = await prisma.technology.update({
    where: { id },
    data: {
      category: category !== undefined ? category : technology.category,
      proficiency: proficiency !== undefined ? proficiency : technology.proficiency,
      yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : technology.yearsOfExperience,
      color: color !== undefined ? color : technology.color,
      icon: icon !== undefined ? icon : technology.icon,
    },
  });

  const skill: Skill = {
    id: updatedTechnology.id,
    name: updatedTechnology.name,
    category: updatedTechnology.category,
    proficiency: updatedTechnology.proficiency,
    yearsOfExperience: updatedTechnology.yearsOfExperience,
    icon: updatedTechnology.icon || undefined,
    color: updatedTechnology.color,
    createdAt: updatedTechnology.createdAt.toISOString(),
    updatedAt: updatedTechnology.updatedAt.toISOString(),
  };

  const response: ApiResponse<Skill> = {
    success: true,
    data: skill,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// DELETE /api/skills/:id - Delete a skill
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const technology = await prisma.technology.findUnique({
    where: { id },
    include: {
      projects: true,
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

  await prisma.technology.delete({
    where: { id },
  });

  const response: ApiResponse<{ id: string }> = {
    success: true,
    data: { id },
    message: 'Skill deleted successfully',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

export default router;
