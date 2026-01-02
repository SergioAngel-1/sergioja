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

  // Agrupar por path para estadísticas
  const byPath = await prisma.pageView.groupBy({
    by: ['path'],
    where: timeRange && timeRange !== 'all' ? { createdAt: where.createdAt as any } : {},
    _count: { path: true },
    orderBy: { _count: { path: 'desc' } },
  });

  const stats = {
    total,
    byPath: Object.fromEntries(
      byPath.map((p: any) => [p.path, p._count.path])
    ),
  };

  logger.info('Page views retrieved', { count: pageViews.length, total });

  res.json({
    success: true,
    data: {
      pageViews,
      stats,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    },
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

  // Agrupar por proyecto para estadísticas
  const byProject = await prisma.projectView.groupBy({
    by: ['projectId'],
    where: timeRange && timeRange !== 'all' ? { createdAt: where.createdAt as any } : {},
    _count: { projectId: true },
    orderBy: { _count: { projectId: 'desc' } },
  });

  const stats = {
    total,
    byProject: Object.fromEntries(
      byProject.map((p: any) => [p.projectId, p._count.projectId])
    ),
  };

  logger.info('Project views retrieved', { count: projectViews.length, total });

  res.json({
    success: true,
    data: {
      projectViews,
      stats,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    },
  });
}));

// GET /api/admin/analytics/web-vitals - Obtener métricas de Web Vitals
router.get('/web-vitals', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { timeRange, metric, rating, limit = '100', offset = '0' } = req.query;

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
        startDate = new Date(0);
        break;
    }

    where.createdAt = { gte: startDate };
  }

  // Filtrar por métrica específica (CLS, LCP, FID, etc.)
  if (metric && typeof metric === 'string') {
    where.name = metric;
  }

  // Filtrar por rating (good, needs-improvement, poor)
  if (rating && typeof rating === 'string') {
    where.rating = rating;
  }

  const webVitals = await prisma.webVitalsMetric.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
  });

  const total = await prisma.webVitalsMetric.count({ where });

  // Calcular estadísticas agregadas
  const stats = {
    total,
    byMetric: {} as Record<string, number>,
    byRating: {} as Record<string, number>,
    averages: {} as Record<string, number>,
  };

  // Agrupar por métrica
  const allMetrics = await prisma.webVitalsMetric.groupBy({
    by: ['name'],
    where: timeRange ? { createdAt: where.createdAt as any } : {},
    _count: { name: true },
    _avg: { value: true },
  });

  allMetrics.forEach((m: any) => {
    stats.byMetric[m.name] = m._count.name;
    stats.averages[m.name] = m._avg.value || 0;
  });

  // Agrupar por rating
  const allRatings = await prisma.webVitalsMetric.groupBy({
    by: ['rating'],
    where: timeRange ? { createdAt: where.createdAt as any } : {},
    _count: { rating: true },
  });

  allRatings.forEach((r: any) => {
    stats.byRating[r.rating] = r._count.rating;
  });

  logger.info('Web Vitals metrics retrieved', { count: webVitals.length, total });

  res.json({
    success: true,
    data: {
      metrics: webVitals,
      stats,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    },
  });
}));

// POST /api/analytics/page-view - Guardar vista de página
router.post('/page-view', asyncHandler(async (req: Request, res: Response) => {
  const { path, ipAddress, userAgent, referrer } = req.body;

  // Validar datos requeridos
  if (!path) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing required field: path',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Log de la vista de página recibida
  logger.info('Page view received', { path, ipAddress, userAgent });

  // Guardar en base de datos
  const pageView = await prisma.pageView.create({
    data: {
      path,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      referrer: referrer || null,
    },
  });

  res.json({
    success: true,
    data: pageView,
    timestamp: new Date().toISOString(),
  });
}));

// POST /api/analytics/project-view - Guardar vista de proyecto
router.post('/project-view', asyncHandler(async (req: Request, res: Response) => {
  const { projectId, ipAddress, userAgent, referrer } = req.body;

  // Validar datos requeridos
  if (!projectId) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Missing required field: projectId',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Verificar que el proyecto existe
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, title: true },
  });

  if (!project) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'PROJECT_NOT_FOUND',
        message: 'Project not found',
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Log de la vista de proyecto recibida
  logger.info('Project view received', { projectId, projectTitle: project.title, ipAddress, userAgent });

  // Guardar en base de datos
  const projectView = await prisma.projectView.create({
    data: {
      projectId,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      referrer: referrer || null,
    },
  });

  res.json({
    success: true,
    data: projectView,
    timestamp: new Date().toISOString(),
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

  // Guardar en base de datos
  await prisma.webVitalsMetric.create({
    data: {
      name,
      value: parseFloat(value),
      rating,
      delta: delta !== undefined ? parseFloat(delta) : null,
      metricId: id,
      navigationType: navigationType || null,
      url,
      userAgent: userAgent || null,
      timestamp: new Date(timestamp || Date.now()),
    },
  });

  res.json({
    success: true,
    data: { received: true },
    timestamp: new Date().toISOString(),
  });
}));

// DELETE /api/admin/analytics/web-vitals - Eliminar todas las métricas
router.delete('/web-vitals', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  const totalBefore = await prisma.webVitalsMetric.count();

  const result = await prisma.webVitalsMetric.deleteMany({});

  logger.warn('All Web Vitals metrics deleted', { deleted: result.count, totalBefore });

  res.json({
    success: true,
    data: {
      deleted: result.count,
      message: 'Todas las métricas de Web Vitals han sido eliminadas',
    },
    timestamp: new Date().toISOString(),
  });
}));

// POST /api/admin/analytics/web-vitals/cleanup - Limpiar métricas antiguas
router.post('/web-vitals/cleanup', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { daysOld = 90 } = req.body;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await prisma.webVitalsMetric.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
    },
  });

  const totalMetrics = await prisma.webVitalsMetric.count();
  const oldestMetric = await prisma.webVitalsMetric.findFirst({
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  });

  logger.info('Web Vitals cleanup completed', { deleted: result.count, remaining: totalMetrics });

  res.json({
    success: true,
    data: {
      deleted: result.count,
      remaining: totalMetrics,
      oldestMetric: oldestMetric?.createdAt,
      cutoffDate,
    },
    timestamp: new Date().toISOString(),
  });
}));

export default router;
