import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { logger } from '../../../lib/logger';
import { asyncHandler } from '../../../middleware/errorHandler';
import { ProjectStatus, isProjectStatus } from './types';

// PUT /api/admin/projects/:slug - Actualizar proyecto
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
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

    // Actualizar tecnologías si se proporcionan (optimizado con batch operations)
    if (technologiesData && Array.isArray(technologiesData)) {
      const techNames = technologiesData.map((t: any) => t.name);
      
      // Buscar todas las tecnologías existentes en una sola query
      const existingTechs = await prisma.technology.findMany({
        where: { name: { in: techNames } },
      });
      
      const existingTechMap = new Map(existingTechs.map((t: any) => [t.name, t]));
      const techsToCreate: any[] = [];
      const techsToUpdate: { id: string; proficiency: number; yearsOfExperience: number }[] = [];
      const projectTechRelations: any[] = [];
      
      // Preparar datos para batch operations
      for (const techData of technologiesData) {
        const { name, category, proficiency, yearsOfExperience } = techData;
        const existingTech = existingTechMap.get(name) as any;
        
        if (!existingTech) {
          techsToCreate.push({
            name,
            category: category || 'other',
            proficiency: proficiency !== undefined ? proficiency : 50,
            yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : 0,
            color: '#FF0000',
          });
        } else {
          const shouldUpdate = 
            (proficiency !== undefined && proficiency > existingTech.proficiency) ||
            (yearsOfExperience !== undefined && yearsOfExperience > existingTech.yearsOfExperience);
          
          if (shouldUpdate) {
            techsToUpdate.push({
              id: existingTech.id,
              proficiency: proficiency !== undefined && proficiency > existingTech.proficiency 
                ? proficiency 
                : existingTech.proficiency,
              yearsOfExperience: yearsOfExperience !== undefined && yearsOfExperience > existingTech.yearsOfExperience
                ? yearsOfExperience
                : existingTech.yearsOfExperience,
            });
          }
        }
      }
      
      // Ejecutar todas las operaciones en una transacción
      await prisma.$transaction(async (tx: any) => {
        // Eliminar relaciones existentes
        await tx.projectTechnology.deleteMany({
          where: { projectId: project.id },
        });
        
        // Crear nuevas tecnologías en batch
        if (techsToCreate.length > 0) {
          await tx.technology.createMany({
            data: techsToCreate,
            skipDuplicates: true,
          });
        }
        
        // Actualizar tecnologías existentes
        for (const techUpdate of techsToUpdate) {
          await tx.technology.update({
            where: { id: techUpdate.id },
            data: {
              proficiency: techUpdate.proficiency,
              yearsOfExperience: techUpdate.yearsOfExperience,
            },
          });
        }
        
        // Obtener todas las tecnologías (incluyendo las recién creadas)
        const allTechs = await tx.technology.findMany({
          where: { name: { in: techNames } },
        });
        
        const techMap = new Map(allTechs.map((t: any) => [t.name, t]));
        
        // Preparar relaciones proyecto-tecnología
        for (const techData of technologiesData) {
          const tech = techMap.get(techData.name) as any;
          if (tech) {
            projectTechRelations.push({
              projectId: project.id,
              technologyId: tech.id,
              category: techData.category || 'other',
              proficiency: techData.proficiency !== undefined ? techData.proficiency : 50,
              yearsOfExperience: techData.yearsOfExperience !== undefined ? techData.yearsOfExperience : 0,
            });
          }
        }
        
        // Crear todas las relaciones en batch
        if (projectTechRelations.length > 0) {
          await tx.projectTechnology.createMany({
            data: projectTechRelations,
          });
        }
      });
    } else if (technologies && Array.isArray(technologies)) {
      // Soporte legacy: solo nombres (también optimizado)
      const existingTechs = await prisma.technology.findMany({
        where: { name: { in: technologies } },
      });
      
      const existingTechMap = new Map(existingTechs.map((t: any) => [t.name, t]));
      const techsToCreate = technologies
        .filter((name: string) => !existingTechMap.has(name))
        .map((name: string) => ({
          name,
          category: 'other',
          color: '#FF0000',
          proficiency: 50,
          yearsOfExperience: 0,
        }));
      
      await prisma.$transaction(async (tx: any) => {
        // Eliminar relaciones existentes
        await tx.projectTechnology.deleteMany({
          where: { projectId: project.id },
        });
        
        // Crear tecnologías faltantes
        if (techsToCreate.length > 0) {
          await tx.technology.createMany({
            data: techsToCreate,
            skipDuplicates: true,
          });
        }
        
        // Obtener todas las tecnologías
        const allTechs = await tx.technology.findMany({
          where: { name: { in: technologies } },
        });
        
        // Crear relaciones en batch
        const relations = allTechs.map((tech: any) => ({
          projectId: project.id,
          technologyId: tech.id,
          category: 'other',
          proficiency: 50,
          yearsOfExperience: 0,
        }));
        
        if (relations.length > 0) {
          await tx.projectTechnology.createMany({
            data: relations,
          });
        }
      });
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

  logger.info('Project updated', { id: project.id, slug });

  res.json({
    success: true,
    data: transformedProject,
  });
});
