import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/admin/projects - Obtener todos los proyectos (incluyendo borradores)
router.get('/', async (req: Request, res: Response) => {
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
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      longDescription: p.longDescription,
      images: p.images || [],
      categories: p.categories || [],
      featured: p.featured,
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
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, longDescription, category, categories, technologies, technologiesData, featured, repoUrl, demoUrl, images, isCodePublic, publishedAt, performanceScore, accessibilityScore, seoScore } = req.body;

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
        longDescription: longDescription || description,
        categories: projectCategories,
        featured: featured || false,
        repoUrl: repoUrl || null,
        demoUrl: demoUrl || null,
        images: Array.isArray(images) ? images : [],
        isCodePublic: isCodePublic !== undefined ? isCodePublic : true,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        performanceScore: performanceScore ?? null,
        accessibilityScore: accessibilityScore ?? null,
        seoScore: seoScore ?? null,
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
              proficiency: proficiency !== undefined ? proficiency : 50,
              yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : 0,
              color: '#FF0000',
            },
          });
        } else {
          // Actualizar Technology con los valores más recientes si son mayores
          const shouldUpdate = 
            (proficiency !== undefined && proficiency > technology.proficiency) ||
            (yearsOfExperience !== undefined && yearsOfExperience > technology.yearsOfExperience);
          
          if (shouldUpdate) {
            await prisma.technology.update({
              where: { id: technology.id },
              data: {
                proficiency: proficiency !== undefined && proficiency > technology.proficiency 
                  ? proficiency 
                  : technology.proficiency,
                yearsOfExperience: yearsOfExperience !== undefined && yearsOfExperience > technology.yearsOfExperience
                  ? yearsOfExperience
                  : technology.yearsOfExperience,
              },
            });
          }
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
router.put('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, description, longDescription, category, categories, technologies, technologiesData, featured, repoUrl, demoUrl, images, isCodePublic, publishedAt, performanceScore, accessibilityScore, seoScore } = req.body;

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
        longDescription: longDescription !== undefined ? longDescription : existingProject.longDescription,
        categories: projectCategories !== undefined ? projectCategories : existingProject.categories,
        featured: featured !== undefined ? featured : existingProject.featured,
        repoUrl: repoUrl !== undefined ? repoUrl : existingProject.repoUrl,
        demoUrl: demoUrl !== undefined ? demoUrl : existingProject.demoUrl,
        images: images !== undefined ? (Array.isArray(images) ? images : []) : existingProject.images,
        isCodePublic: isCodePublic !== undefined ? isCodePublic : existingProject.isCodePublic,
        publishedAt: publishedAt !== undefined ? (publishedAt ? new Date(publishedAt) : null) : existingProject.publishedAt,
        performanceScore: performanceScore !== undefined ? performanceScore : existingProject.performanceScore,
        accessibilityScore: accessibilityScore !== undefined ? accessibilityScore : existingProject.accessibilityScore,
        seoScore: seoScore !== undefined ? seoScore : existingProject.seoScore,
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
              proficiency: proficiency !== undefined ? proficiency : 50,
              yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : 0,
              color: '#FF0000',
            },
          });
        } else {
          // Actualizar Technology con los valores más recientes si son mayores
          const shouldUpdate = 
            (proficiency !== undefined && proficiency > technology.proficiency) ||
            (yearsOfExperience !== undefined && yearsOfExperience > technology.yearsOfExperience);
          
          if (shouldUpdate) {
            await prisma.technology.update({
              where: { id: technology.id },
              data: {
                proficiency: proficiency !== undefined && proficiency > technology.proficiency 
                  ? proficiency 
                  : technology.proficiency,
                yearsOfExperience: yearsOfExperience !== undefined && yearsOfExperience > technology.yearsOfExperience
                  ? yearsOfExperience
                  : technology.yearsOfExperience,
              },
            });
          }
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
router.delete('/:slug', async (req: Request, res: Response) => {
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
