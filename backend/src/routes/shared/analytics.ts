import { Router, Request, Response } from 'express';
import { ApiResponse, AnalyticsSummary } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { authMiddleware } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

// GET /api/analytics/summary - Get analytics summary
router.get('/summary', asyncHandler(async (_req: Request, res: Response) => {
  const [totalProjects, totalSkills, completedProjects, inProgressProjects] = await Promise.all([
    prisma.project.count({ where: { publishedAt: { not: null } } }),
    prisma.technology.count(),
    prisma.project.count({ where: { publishedAt: { not: null } } }),
    0, // No hay campo de estado en el schema actual
  ]);

  const analytics: AnalyticsSummary = {
    totalProjects,
    totalSkills,
    yearsOfExperience: 5, // Valor fijo o calculado desde timeline
    completedProjects,
    inProgressProjects,
  };

  const response: ApiResponse<AnalyticsSummary> = {
    success: true,
    data: analytics,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
}));

// Admin endpoints - requieren autenticación
// GET /api/admin/analytics/page-views - Obtener vistas de páginas
router.get('/page-views', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { timeRange, limit = '100', offset = '0' } = req.query;

  const where: Record<string, unknown> = {};

  // Filtrar por rango de tiempo
  if (timeRange && typeof timeRange === 'string') {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Desde el inicio
        break;
    }

    where.createdAt = { gte: startDate };
  }

  const pageViews = await prisma.pageView.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
  });

  const total = await prisma.pageView.count({ where });

  logger.info('Page views retrieved', { count: pageViews.length, total });

  res.json({
    success: true,
    data: pageViews,
  });
}));

// GET /api/admin/analytics/project-views - Obtener vistas de proyectos
router.get('/project-views', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { timeRange, limit = '100', offset = '0' } = req.query;

  const where: Record<string, unknown> = {};

  // Filtrar por rango de tiempo
  if (timeRange && typeof timeRange === 'string') {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Desde el inicio
        break;
    }

    where.createdAt = { gte: startDate };
  }

  const projectViews = await prisma.projectView.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    include: {
      project: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  const total = await prisma.projectView.count({ where });

  logger.info('Project views retrieved', { count: projectViews.length, total });

  res.json({
    success: true,
    data: projectViews,
  });
}));

// POST /api/analytics/web-vitals - Recibir métricas de Web Vitals
router.post('/web-vitals', asyncHandler(async (req: Request, res: Response) => {
  const { name, value, rating, delta, id, navigationType, url, userAgent, timestamp } = req.body;

  // Validar datos requeridos
  if (!name || value === undefined || !rating) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing required fields: name, value, rating',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Log de la métrica recibida
  logger.info('Web Vitals metric received', {
    name,
    value,
    rating,
    url,
    timestamp: new Date(timestamp || Date.now()).toISOString(),
  });

  // TODO: Guardar en base de datos si se necesita persistencia
  // await prisma.webVitalsMetric.create({
  //   data: { name, value, rating, delta, id, navigationType, url, userAgent, timestamp: new Date(timestamp) }
  // });

  res.json({
    success: true,
    data: { received: true },
    timestamp: new Date().toISOString(),
  });
}));

export default router;
