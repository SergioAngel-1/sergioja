import { Router, Request, Response } from 'express';
import { ApiResponse, TimelineItem } from '../../../shared/types';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

const router = Router();

// GET /api/timeline - Get timeline events
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    const where: any = {};
    if (type && typeof type === 'string') {
      where.type = type;
    }

    const events = await prisma.timelineEvent.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });

    const timeline: TimelineItem[] = events.map((e) => ({
      id: e.id,
      title: e.title,
      organization: e.organization,
      type: e.type as 'work' | 'education' | 'project' | 'achievement',
      description: e.description,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString(),
      current: e.current,
      skills: e.technologies,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));

    const response: ApiResponse<TimelineItem[]> = {
      success: true,
      data: timeline,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    logger.error('Error fetching timeline', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch timeline',
        code: 'INTERNAL_ERROR',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
