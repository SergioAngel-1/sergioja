import { Router, Request, Response } from 'express';
import { ApiResponse, AnalyticsSummary } from '../../../shared/types';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

const router = Router();

// GET /api/analytics/summary - Get analytics summary
router.get('/summary', async (_req: Request, res: Response) => {
  try {
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
  } catch (error) {
    logger.error('Error fetching analytics', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch analytics',
        code: 'INTERNAL_ERROR',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
