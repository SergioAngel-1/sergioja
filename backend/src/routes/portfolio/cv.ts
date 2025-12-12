import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';

const router = Router();

// GET /api/portfolio/cv - Download CV file
router.get('/', async (_req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.findFirst();
    
    if (!profile || !profile.cvData) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'CV not found',
          code: 'CV_NOT_FOUND',
        },
      });
    }

    // Decode base64 to buffer
    const buffer = Buffer.from(profile.cvData, 'base64');
    const fileName = profile.cvFileName || 'CV.pdf';
    const mimeType = profile.cvMimeType || 'application/pdf';

    // Set headers for file download
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);
    
    res.send(buffer);
  } catch (error) {
    logger.error('Error serving CV', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to serve CV',
        code: 'INTERNAL_ERROR',
      },
    });
  }
});

export default router;
