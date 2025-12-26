import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { logger } from '../../../lib/logger';
import { slugify } from '../../../lib/slugify';
import { findAvailableSlug, validateSlug } from '../../../lib/slugHelpers';
import { updateRedirectChain } from '../../../lib/redirectHelpers';
import { asyncHandler } from '../../../middleware/errorHandler';

// POST /api/admin/projects/:slug/regenerate-slug - Regenerar slug desde el título o manual
export const regenerateSlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug: currentSlug } = req.params;
  const { title: newTitle, manualSlug } = req.body;

  // Buscar el proyecto actual
  const existingProject = await prisma.project.findUnique({
    where: { slug: currentSlug },
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

  let newSlug: string;

  // Si se proporciona un slug manual, usarlo directamente
  if (manualSlug) {
    newSlug = slugify(manualSlug.trim());

    if (!newSlug) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SLUG',
          message: 'La URL personalizada no contiene caracteres válidos',
        },
      });
    }

    if (newSlug.length > 100) {
      newSlug = newSlug.substring(0, 100);
    }

    try {
      validateSlug(newSlug);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SLUG',
          message: error instanceof Error ? error.message : 'El slug no es válido',
        },
      });
    }
  } else {
    // Si se proporciona un nuevo título, usarlo; si no, usar el título actual
    const titleToSlugify = newTitle || existingProject.title;
    
    // Generar nuevo slug desde el título
    newSlug = slugify(titleToSlugify);
  }

  // Si el nuevo slug es igual al actual, no hacer nada
  if (newSlug === existingProject.slug) {
    return res.json({
      success: true,
      data: {
        oldSlug: existingProject.slug,
        newSlug: newSlug,
        changed: false,
        message: 'El slug ya está actualizado',
      },
    });
  }

  // Encontrar slug disponible (optimizado para evitar N+1 queries)
  // Solo si NO es un slug manual (los slugs manuales se usan tal cual)
  if (!manualSlug) {
    newSlug = await findAvailableSlug(newSlug, existingProject.id);
  } else {
    // Para slugs manuales, verificar que no exista otro proyecto con ese slug
    const existingWithSlug = await prisma.project.findUnique({
      where: { slug: newSlug },
    });
    
    if (existingWithSlug && existingWithSlug.id !== existingProject.id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SLUG_EXISTS',
          message: `Ya existe otro proyecto con la URL "${newSlug}"`,
        },
      });
    }
  }

  // Crear redirección SEO si el slug cambió
  if (newSlug !== currentSlug) {
    await updateRedirectChain(existingProject.id, currentSlug, newSlug);
  }

  // Actualizar el proyecto con el nuevo slug
  const updatedProject = await prisma.project.update({
    where: { id: existingProject.id },
    data: { slug: newSlug },
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
    ...updatedProject,
    technologies: updatedProject.technologies.map((pt: any) => ({
      name: pt.technology.name,
      category: pt.category,
      proficiency: pt.proficiency,
      yearsOfExperience: pt.yearsOfExperience,
      icon: pt.technology.icon,
      color: pt.technology.color,
    })),
  };

  logger.info('Slug regenerated', { 
    projectId: existingProject.id, 
    oldSlug: currentSlug, 
    newSlug: newSlug 
  });

  res.json({
    success: true,
    data: {
      oldSlug: currentSlug,
      newSlug: newSlug,
      changed: newSlug !== currentSlug,
      project: transformedProject,
    },
  });
});
