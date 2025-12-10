import { Router, Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';

const router = Router();

// GET /api/categories/projects - Obtener categorías de proyectos (solo activas)
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.projectCategory.findMany({
      where: { active: true }, // Solo categorías activas
      orderBy: { order: 'asc' },
      select: {
        name: true,
        label: true,
        color: true,
        icon: true,
        active: true,
      },
    });

    const response: ApiResponse<typeof categories> = {
      success: true,
      data: categories,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    logger.error('Error fetching project categories', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener categorías de proyectos',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/categories/technologies - Obtener categorías de tecnologías (solo activas)
router.get('/technologies', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.technologyCategory.findMany({
      where: { active: true }, // Solo categorías activas
      orderBy: { order: 'asc' },
      select: {
        name: true,
        label: true,
        color: true,
        icon: true,
        active: true,
      },
    });

    const response: ApiResponse<typeof categories> = {
      success: true,
      data: categories,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    logger.error('Error fetching technology categories', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener categorías de tecnologías',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
