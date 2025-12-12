import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { authMiddleware, adminRoleMiddleware } from '../../middleware/auth';

const router = Router();

const serveCv = async (_req: Request, res: Response) => {
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

    const buffer = Buffer.from(profile.cvData, 'base64');
    const fileName = profile.cvFileName || 'CV.pdf';
    const mimeType = profile.cvMimeType || 'application/pdf';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  } catch (error) {
    logger.error('Error serving CV (admin)', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to serve CV',
        code: 'INTERNAL_ERROR',
      },
    });
  }
};

router.get('/', authMiddleware, adminRoleMiddleware, serveCv);
router.get('/:fileName', authMiddleware, adminRoleMiddleware, serveCv);

export default router;
