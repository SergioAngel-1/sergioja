import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { logger } from '../../../lib/logger';
import { slugify } from '../../../lib/slugify';
import { asyncHandler } from '../../../middleware/errorHandler';
import { ProjectStatus, isProjectStatus } from './types';

// POST /api/admin/projects - Crear nuevo proyecto
export const createProject = asyncHandler(async (req: Request, res: Response) => {
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

    // Validaciones básicas
    if (!title) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Título es requerido',
        },
      });
    }

    const resolvedLongDescriptionEs = (longDescriptionEs ?? longDescription) ?? null;
    const resolvedLongDescriptionEn = longDescriptionEn ?? null;

    if (!resolvedLongDescriptionEs && !resolvedLongDescriptionEn) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Debes proporcionar una descripción detallada (ES y/o EN)',
        },
      });
    }

    // Crear slug desde el título (normalizar acentos y caracteres especiales)
    let slug = slugify(title);

    // Validar que el slug no esté vacío (puede ocurrir si el título solo tiene caracteres especiales)
    if (!slug || slug.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El título debe contener al menos un carácter alfanumérico válido',
        },
      });
    }

    // Validar longitud máxima del slug
    if (slug.length > 100) {
      slug = slug.substring(0, 100);
      logger.warn('Slug truncated to 100 characters', { originalLength: slug.length, title });
    }

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
    const resolvedStatus: ProjectStatus = isProjectStatus(status)
      ? status
      : (publishedAt ? 'PUBLISHED' : 'DRAFT');

    const resolvedPublishedAt = resolvedStatus === 'PUBLISHED'
      ? (publishedAt ? new Date(publishedAt) : new Date())
      : null;

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        longDescriptionEs: resolvedLongDescriptionEs,
        longDescriptionEn: resolvedLongDescriptionEn,
        categories: projectCategories,
        status: resolvedStatus,
        isFeatured: (isFeatured !== undefined ? isFeatured : featured) || false,
        repoUrl: repoUrl || null,
        demoUrl: demoUrl || null,
        images: Array.isArray(images) ? images : [],
        isCodePublic: isCodePublic !== undefined ? isCodePublic : true,
        publishedAt: resolvedPublishedAt,
        performanceScore: performanceScore ?? null,
        accessibilityScore: accessibilityScore ?? null,
        seoScore: seoScore ?? null,
      },
    });

    // Agregar tecnologías con información completa (optimizado con batch operations)
    if (technologiesData && Array.isArray(technologiesData) && technologiesData.length > 0) {
      // Obtener nombres únicos de tecnologías
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
          // Tecnología nueva - preparar para createMany
          techsToCreate.push({
            name,
            category: category || 'other',
            proficiency: proficiency !== undefined ? proficiency : 50,
            yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : 0,
            color: '#FF0000',
          });
        } else {
          // Tecnología existente - verificar si necesita actualización
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
    } else if (technologies && Array.isArray(technologies) && technologies.length > 0) {
      // Soporte legacy: solo nombres de tecnologías (también optimizado)
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
});
