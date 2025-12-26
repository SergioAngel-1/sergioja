import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { logger } from '../../../lib/logger';
import { asyncHandler } from '../../../middleware/errorHandler';
import { bumpProjectCacheVersion } from '../../../lib/cacheVersion';

// DELETE /api/admin/projects/:slug - Eliminar proyecto
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
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

    // Convertir todas las redirecciones existentes del proyecto para que apunten a /projects
    await prisma.slugRedirect.updateMany({
      where: { projectId: existingProject.id },
      data: { newSlug: 'projects' },
    });

    // Crear redirección hacia /projects para el slug actual
    try {
      await prisma.slugRedirect.create({
        data: {
          projectId: existingProject.id,
          oldSlug: existingProject.slug,
          newSlug: 'projects',
        },
      });
    } catch (redirectError) {
      logger.warn('Failed to create redirect for deleted project', {
        slug: existingProject.slug,
        error: redirectError instanceof Error ? redirectError.message : redirectError,
      });
    }

    // Eliminar proyecto
    await prisma.project.delete({
      where: { slug },
    });

  logger.info('Project deleted', { slug });

  const cacheVersion = bumpProjectCacheVersion('project_deleted');

  res.json({
    success: true,
    data: { slug },
    cacheVersion,
  });
});
