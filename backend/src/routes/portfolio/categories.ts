import { Router, Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

// GET /api/categories/projects - Obtener categorías de proyectos (solo activas)
router.get('/projects', asyncHandler(async (req: Request, res: Response) => {
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
}));

// GET /api/categories/technologies - Obtener categorías de tecnologías (solo activas)
router.get('/technologies', asyncHandler(async (req: Request, res: Response) => {
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
}));

export default router;
