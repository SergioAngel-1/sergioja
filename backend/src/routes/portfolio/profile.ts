import { Router, Request, Response } from 'express';
import { ApiResponse, Profile } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { authMiddleware, adminRoleMiddleware } from '../../middleware/auth';

const router = Router();

// GET /api/profile - Get profile information
router.get('/', async (_req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.findFirst();
    
    if (!profile) {
      return res.status(200).json({
        success: true,
        data: null,
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

// PUT /api/profile - Update profile information (admin only)
router.put('/', authMiddleware, adminRoleMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, availability, location, email, githubUrl, linkedinUrl, twitterUrl } = req.body;

    // Validaciones básicas
    if (!name || !email || !location) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Name, email, and location are required',
          code: 'VALIDATION_ERROR',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid email format',
          code: 'VALIDATION_ERROR',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Validar availability
    const validAvailability = ['available', 'busy', 'unavailable'];
    if (availability && !validAvailability.includes(availability)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid availability status',
          code: 'VALIDATION_ERROR',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Obtener el perfil existente
    const existingProfile = await prisma.profile.findFirst();
    
    let updatedProfile;
    
    if (!existingProfile) {
      // Crear nuevo perfil si no existe
      updatedProfile = await prisma.profile.create({
        data: {
          name,
          availability: availability || 'available',
          location,
          email,
          githubUrl: githubUrl || null,
          linkedinUrl: linkedinUrl || null,
          twitterUrl: twitterUrl || null,
        },
      });
    } else {
      // Actualizar perfil existente
      updatedProfile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          name,
          availability: availability || existingProfile.availability,
          location,
          email,
          githubUrl: githubUrl || null,
          linkedinUrl: linkedinUrl || null,
          twitterUrl: twitterUrl || null,
        },
      });
    }

    const response: ApiResponse<Profile> = {
      success: true,
      data: {
        id: updatedProfile.id,
        name: updatedProfile.name,
        availability: updatedProfile.availability,
        location: updatedProfile.location,
        email: updatedProfile.email,
        githubUrl: updatedProfile.githubUrl || null,
        linkedinUrl: updatedProfile.linkedinUrl || null,
        twitterUrl: updatedProfile.twitterUrl || null,
        createdAt: updatedProfile.createdAt.toISOString(),
        updatedAt: updatedProfile.updatedAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    logger.error('Error updating profile', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update profile',
        code: 'INTERNAL_ERROR',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
