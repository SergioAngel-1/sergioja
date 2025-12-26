import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { logger } from '../../../lib/logger';
import { slugify } from '../../../lib/slugify';
import { asyncHandler } from '../../../middleware/errorHandler';

// POST /api/admin/projects/:slug/regenerate-slug - Regenerar slug desde el título
export const regenerateSlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug: currentSlug } = req.params;
  const { title: newTitle } = req.body;

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

  // Si se proporciona un nuevo título, usarlo; si no, usar el título actual
  const titleToSlugify = newTitle || existingProject.title;

  // Generar nuevo slug desde el título
  let newSlug = slugify(titleToSlugify);

  // Si el nuevo slug es igual al actual, no hacer nada
  if (newSlug === currentSlug) {
    return res.json({
      success: true,
      data: {
        oldSlug: currentSlug,
        newSlug: newSlug,
        changed: false,
        message: 'El slug ya está actualizado',
      },
    });
  }

  // Verificar si el nuevo slug ya existe en otro proyecto
  let slugExists = await prisma.project.findUnique({ 
    where: { slug: newSlug },
  });
  
  let counter = 1;
  const baseSlug = newSlug;
  
  while (slugExists && slugExists.id !== existingProject.id) {
    newSlug = `${baseSlug}-${counter}`;
    slugExists = await prisma.project.findUnique({ where: { slug: newSlug } });
    counter++;
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
      changed: true,
      project: transformedProject,
    },
  });
});
