import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { logger } from '../../../lib/logger';

// DELETE /api/admin/projects/:slug - Eliminar proyecto
export const deleteProject = async (req: Request, res: Response) => {
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
};
