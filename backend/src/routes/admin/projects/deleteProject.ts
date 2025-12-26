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
