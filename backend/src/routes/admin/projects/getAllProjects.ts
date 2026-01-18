import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { logger } from '../../../lib/logger';
import { asyncHandler } from '../../../middleware/errorHandler';

// GET /api/admin/projects - Obtener todos los proyectos (incluyendo borradores)
export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured, status, search, page = '1', limit = '20' } = req.query;
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

    // Filtro por status
    if (status && typeof status === 'string' && status !== 'all') {
      if (status === 'published') {
        where.status = 'PUBLISHED';
      } else if (status === 'in_progress') {
        where.status = 'IN_PROGRESS';
      } else if (status === 'draft') {
        where.status = 'DRAFT';
      } else if (status === 'featured') {
        where.isFeatured = true;
      }
    }

    // Filtro por búsqueda (título o descripción)
    if (search && typeof search === 'string' && search.trim().length > 0) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { longDescriptionEs: { contains: search, mode: 'insensitive' } },
        { longDescriptionEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.project.count({ where });

    // Get projects with technologies
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
              },
            },
          },
        },
      },
      orderBy: [
        { displayOrder: { sort: 'asc', nulls: 'last' } },
        { createdAt: 'desc' }
      ],
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
      thumbnailImage: p.thumbnailImage || null,
      imagesDesktop: p.imagesDesktop || [],
      imagesMobile: p.imagesMobile || [],
      categories: p.categories || [],
      status: p.status,
      isFeatured: p.isFeatured,
      displayOrder: p.displayOrder ?? null,
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

  logger.info('Admin projects retrieved', { count: transformedProjects.length, total, page: pageNum, limit: limitNum });

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
  });
});
