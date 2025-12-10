import { Router, Request, Response } from 'express';
import { ApiResponse, Project, PaginatedResponse } from '../../../shared/types';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { authMiddleware } from '../middleware/auth';

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
      where.categories = {
        has: category, // Buscar si el array contiene la categoría
      };
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
      orderBy: { publishedAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    // Transform to match frontend interface
    const transformedProjects: Project[] = projects.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      longDescription: p.longDescription || undefined,
      image: p.image || undefined,
      categories: p.categories || [],
      featured: p.featured,
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
      
      // Campos derivados/computados
      category: Array.isArray(p.categories) && p.categories.length > 0 ? p.categories[0] : 'web',
      technologies: p.technologies.map((t: any) => t.technology.name),
      tech: p.technologies.map((t: any) => t.technology.name),
      status: 'completed' as const,
      metrics: p.performanceScore ? {
        performance: p.performanceScore,
        accessibility: p.accessibilityScore || 0,
        seo: p.seoScore || 0,
      } : undefined,
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
    // Graceful fallback: respond with empty list to avoid breaking UI
    const pageNum = parseInt((req.query.page as string) || '1', 10);
    const limitNum = parseInt((req.query.limit as string) || '10', 10);
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
      message: 'No projects available',
      timestamp: new Date().toISOString(),
    };
    res.json(emptyResponse);
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
      slug: project.slug,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || undefined,
      image: project.image || undefined,
      categories: project.categories || [],
      featured: project.featured,
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
      
      // Campos derivados/computados
      category: project.categories?.[0] || 'web',
      technologies: project.technologies.map((t: any) => t.technology.name),
      tech: project.technologies.map((t: any) => t.technology.name),
      status: 'completed' as const,
      metrics: project.performanceScore ? {
        performance: project.performanceScore,
        accessibility: project.accessibilityScore || 0,
        seo: project.seoScore || 0,
      } : undefined,
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

// Admin endpoints - requieren autenticación
// GET /api/admin/projects - Obtener todos los proyectos (incluyendo borradores)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { category, featured, page = '1', limit = '100' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Build where clause - NO filtrar por publishedAt para admin
    const where: Record<string, unknown> = {};
    
    if (category && typeof category === 'string') {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
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
      // Campos base del schema de Prisma
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      longDescription: p.longDescription,
      image: p.image,
      categories: p.categories || [],
      featured: p.featured,
      demoUrl: p.demoUrl,
      repoUrl: p.repoUrl,
      githubUrl: p.githubUrl || p.repoUrl, // Alias for repoUrl
      isCodePublic: p.isCodePublic,
      performanceScore: p.performanceScore,
      accessibilityScore: p.accessibilityScore,
      seoScore: p.seoScore,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      
      // Campos derivados/computados para el frontend
      category: Array.isArray(p.categories) && p.categories.length > 0 ? p.categories[0] : 'web',
      technologies: p.technologies.map((t: any) => ({
        name: t.technology.name,
        category: t.category,
        proficiency: t.proficiency,
        yearsOfExperience: t.yearsOfExperience,
        technology: t.technology,
      })),
    }));

    logger.info('Admin projects retrieved', { count: transformedProjects.length, total });

    res.json({
      success: true,
      data: transformedProjects,
    });
  } catch (error) {
    logger.error('Error fetching admin projects', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener proyectos',
      },
    });
  }
});

// POST /api/admin/projects - Crear nuevo proyecto
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, description, category, categories, technologies, technologiesData, featured, repoUrl, demoUrl, image, isCodePublic, publishedAt } = req.body;

    // Validaciones básicas
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Título y descripción son requeridos',
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
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        longDescription: description, // Usar la misma descripción por ahora
        categories: projectCategories,
        featured: featured || false,
        repoUrl: repoUrl || null,
        demoUrl: demoUrl || null,
        image: image || null,
        isCodePublic: isCodePublic !== undefined ? isCodePublic : true,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    // Agregar tecnologías con información completa
    if (technologiesData && Array.isArray(technologiesData) && technologiesData.length > 0) {
      for (const techData of technologiesData) {
        const { name, category, proficiency, yearsOfExperience } = techData;
        
        // Buscar o crear tecnología
        let technology = await prisma.technology.findUnique({
          where: { name },
        });

        if (!technology) {
          technology = await prisma.technology.create({
            data: {
              name,
              category: category || 'other',
              color: '#00FF00', // Color por defecto
            },
          });
        }

        // Crear relación con datos específicos del proyecto
        await prisma.projectTechnology.create({
          data: {
            projectId: project.id,
            technologyId: technology.id,
            category: category || 'other',
            proficiency: proficiency !== undefined ? proficiency : 50,
            yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : 0,
          },
        });
      }
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
              color: '#00FF00',
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

    logger.info('Project created', { id: project.id, title: project.title });

    res.status(201).json({
      success: true,
      data: projectWithRelations,
    });
  } catch (error) {
    logger.error('Error creating project', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al crear proyecto',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
      },
    });
  }
});

// PUT /api/admin/projects/:slug - Actualizar proyecto
router.put('/:slug', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, description, category, categories, technologies, technologiesData, featured, repoUrl, demoUrl, image, isCodePublic, publishedAt } = req.body;

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
    const project = await prisma.project.update({
      where: { slug },
      data: {
        title: title || existingProject.title,
        description: description || existingProject.description,
        longDescription: description || existingProject.longDescription,
        categories: projectCategories !== undefined ? projectCategories : existingProject.categories,
        featured: featured !== undefined ? featured : existingProject.featured,
        repoUrl: repoUrl !== undefined ? repoUrl : existingProject.repoUrl,
        demoUrl: demoUrl !== undefined ? demoUrl : existingProject.demoUrl,
        image: image !== undefined ? image : existingProject.image,
        isCodePublic: isCodePublic !== undefined ? isCodePublic : existingProject.isCodePublic,
        publishedAt: publishedAt !== undefined ? (publishedAt ? new Date(publishedAt) : null) : existingProject.publishedAt,
      },
    });

    // Actualizar tecnologías si se proporcionan
    if (technologiesData && Array.isArray(technologiesData)) {
      // Eliminar relaciones existentes
      await prisma.projectTechnology.deleteMany({
        where: { projectId: project.id },
      });

      // Agregar nuevas tecnologías con información completa
      for (const techData of technologiesData) {
        const { name, category, proficiency, yearsOfExperience } = techData;
        
        let technology = await prisma.technology.findUnique({
          where: { name },
        });

        if (!technology) {
          technology = await prisma.technology.create({
            data: {
              name,
              category: category || 'other',
              color: '#00FF00',
            },
          });
        }

        await prisma.projectTechnology.create({
          data: {
            projectId: project.id,
            technologyId: technology.id,
            category: category || 'other',
            proficiency: proficiency !== undefined ? proficiency : 50,
            yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : 0,
          },
        });
      }
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
              color: '#00FF00',
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

    logger.info('Project updated', { id: project.id, slug: project.slug });

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    logger.error('Error updating project', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al actualizar proyecto',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
      },
    });
  }
});

// DELETE /api/admin/projects/:slug - Eliminar proyecto
router.delete('/:slug', authMiddleware, async (req: Request, res: Response) => {
  try {
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

    // Eliminar relaciones de tecnologías
    await prisma.projectTechnology.deleteMany({
      where: { projectId: existingProject.id },
    });

    // Eliminar proyecto
    await prisma.project.delete({
      where: { slug },
    });

    logger.info('Project deleted', { slug });

    res.json({
      success: true,
      data: { slug },
    });
  } catch (error) {
    logger.error('Error deleting project', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al eliminar proyecto',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
      },
    });
  }
});

export default router;
