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
      title: p.title,
      slug: p.slug,
      description: p.description,
      longDescription: p.longDescription || undefined,
      image: p.image || undefined,
      technologies: p.technologies.map((t: any) => t.technology.name),
      tech: p.technologies.map((t: any) => t.technology.name),
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
      title: project.title,
      slug: project.slug,
      description: project.description,
      longDescription: project.longDescription || undefined,
      image: project.image || undefined,
      technologies: project.technologies.map((t: any) => t.technology.name),
      tech: project.technologies.map((t: any) => t.technology.name),
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

    logger.info('Admin projects retrieved', { count: projects.length, total });

    res.json({
      success: true,
      data: projects,
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
    const { title, description, category, technologies, technologiesData, featured, repoUrl, demoUrl, image, isCodePublic } = req.body;

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
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Crear proyecto
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        longDescription: description, // Usar la misma descripción por ahora
        category: category || 'web',
        featured: featured || false,
        repoUrl: repoUrl || null,
        demoUrl: demoUrl || null,
        image: image || null,
        isCodePublic: isCodePublic !== undefined ? isCodePublic : true,
        publishedAt: new Date(),
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

    logger.info('Project created', { id: project.id, title: project.title });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    logger.error('Error creating project', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al crear proyecto',
      },
    });
  }
});

// PUT /api/admin/projects/:slug - Actualizar proyecto
router.put('/:slug', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, description, category, technologies, technologiesData, featured, repoUrl, demoUrl, image, isCodePublic } = req.body;

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

    // Actualizar proyecto
    const project = await prisma.project.update({
      where: { slug },
      data: {
        title: title || existingProject.title,
        description: description || existingProject.description,
        longDescription: description || existingProject.longDescription,
        category: category || existingProject.category,
        featured: featured !== undefined ? featured : existingProject.featured,
        repoUrl: repoUrl !== undefined ? repoUrl : existingProject.repoUrl,
        demoUrl: demoUrl !== undefined ? demoUrl : existingProject.demoUrl,
        image: image !== undefined ? image : existingProject.image,
        isCodePublic: isCodePublic !== undefined ? isCodePublic : existingProject.isCodePublic,
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
      },
    });
  }
});

export default router;
