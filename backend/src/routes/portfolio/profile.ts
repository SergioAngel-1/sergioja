import { Router, Request, Response } from 'express';
import { ApiResponse, Profile } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';

const router = Router();

// GET /api/profile - Get profile information
router.get('/', async (_req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.findFirst();
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Profile not found',
          code: 'PROFILE_NOT_FOUND',
        },
        timestamp: new Date().toISOString(),
      });
    }

    const response: ApiResponse<Profile> = {
      success: true,
      data: {
        id: profile.id,
        name: profile.name,
        availability: profile.availability,
        location: profile.location,
        email: profile.email,
        githubUrl: profile.githubUrl || null,
        linkedinUrl: profile.linkedinUrl || null,
        twitterUrl: profile.twitterUrl || null,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    logger.error('Error fetching profile', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch profile',
        code: 'INTERNAL_ERROR',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
