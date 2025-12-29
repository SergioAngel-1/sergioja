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

    // BUG #6 FIX: Convertir redirects a /projects y limpiar projectId
    await prisma.slugRedirect.updateMany({
      where: { projectId: existingProject.id },
      data: { 
        newSlug: 'projects',
        projectId: null, // Limpiar referencia al proyecto eliminado
      },
    });

    // Crear redirección hacia /projects para el slug actual (sin projectId)
    try {
      await prisma.slugRedirect.create({
        data: {
          projectId: null, // No mantener referencia a proyecto eliminado
          oldSlug: existingProject.slug,
          newSlug: 'projects',
        },
      });
      
      logger.info('Created redirect for deleted project', {
        slug: existingProject.slug,
        projectId: existingProject.id,
      });
    } catch (redirectError) {
      // Si ya existe el redirect (duplicate key), solo actualizar
      if ((redirectError as any).code === 'P2002') {
        await prisma.slugRedirect.update({
          where: { oldSlug: existingProject.slug },
          data: { 
            newSlug: 'projects',
            projectId: null,
          },
        });
        logger.info('Updated existing redirect for deleted project', {
          slug: existingProject.slug,
        });
      } else {
        logger.warn('Failed to create redirect for deleted project', {
          slug: existingProject.slug,
          error: redirectError instanceof Error ? redirectError.message : redirectError,
        });
      }
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
