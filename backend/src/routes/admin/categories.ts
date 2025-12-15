import { Router, Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { authMiddleware } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

// GET /api/admin/categories/projects - Obtener categorías de proyectos
router.get('/projects', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.projectCategory.findMany({
    orderBy: { order: 'asc' },
  });

  const response: ApiResponse<typeof categories> = {
    success: true,
    data: categories,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// GET /api/admin/categories/technologies - Obtener categorías de tecnologías
router.get('/technologies', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.technologyCategory.findMany({
    orderBy: { order: 'asc' },
  });

  const response: ApiResponse<typeof categories> = {
    success: true,
    data: categories,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// POST /api/admin/categories/projects - Crear categoría de proyecto
router.post('/projects', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { name, label, description, color, icon, order, active } = req.body;

  if (!name || !label) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Nombre y etiqueta son requeridos',
      },
    });
  }

  const category = await prisma.projectCategory.create({
    data: {
      name,
      label,
      description,
      color: color || '#00FF00',
      icon,
      order: order || 0,
      active: active !== undefined ? active : true,
    },
  });

  const response: ApiResponse<typeof category> = {
    success: true,
    data: category,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// POST /api/admin/categories/technologies - Crear categoría de tecnología
router.post('/technologies', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { name, label, description, color, icon, order, active } = req.body;

  if (!name || !label) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Nombre y etiqueta son requeridos',
      },
    });
  }

  const category = await prisma.technologyCategory.create({
    data: {
      name,
      label,
      description,
      color: color || '#00FF00',
      icon,
      order: order || 0,
      active: active !== undefined ? active : true,
    },
  });

  const response: ApiResponse<typeof category> = {
    success: true,
    data: category,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// PUT /api/admin/categories/projects/:id - Actualizar categoría de proyecto
router.put('/projects/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, label, description, color, icon, order, active } = req.body;

  const category = await prisma.projectCategory.update({
    where: { id },
    data: {
      name,
      label,
      description,
      color,
      icon,
      order,
      active,
    },
  });

  const response: ApiResponse<typeof category> = {
    success: true,
    data: category,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// PUT /api/admin/categories/technologies/:id - Actualizar categoría de tecnología
router.put('/technologies/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, label, description, color, icon, order, active } = req.body;

  const category = await prisma.technologyCategory.update({
    where: { id },
    data: {
      name,
      label,
      description,
      color,
      icon,
      order,
      active,
    },
  });

  const response: ApiResponse<typeof category> = {
    success: true,
    data: category,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// DELETE /api/admin/categories/projects/:id - Eliminar categoría de proyecto
router.delete('/projects/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.projectCategory.delete({
    where: { id },
  });

  const response: ApiResponse<null> = {
    success: true,
    data: null,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// DELETE /api/admin/categories/technologies/:id - Eliminar categoría de tecnología
router.delete('/technologies/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.technologyCategory.delete({
    where: { id },
  });

  const response: ApiResponse<null> = {
    success: true,
    data: null,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

export default router;
