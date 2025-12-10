import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { ApiResponse } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { verifyRecaptchaEnterprise } from '../../services/recaptchaService';
import { emailService } from '../../services/emailService';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.post(
  '/subscribe',
  [body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array(),
        },
        timestamp: new Date().toISOString(),
      } satisfies ApiResponse);
    }

    const { email, recaptchaToken, recaptchaAction, source } = req.body as {
      email: string;
      recaptchaToken?: string;
      recaptchaAction?: string;
      source?: 'main' | 'portfolio';
    };

    try {
      const expectedAction = recaptchaAction || 'subscribe_newsletter';
      const { valid, score, reasons } = await verifyRecaptchaEnterprise(recaptchaToken || '', expectedAction);
      if (!valid) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'reCAPTCHA verification failed',
            code: 'RECAPTCHA_INVALID',
            details: { score, reasons },
          },
          timestamp: new Date().toISOString(),
        } satisfies ApiResponse);
      }
    } catch (err) {
      logger.error('reCAPTCHA verification error (newsletter)', err as any);
      return res.status(400).json({
        success: false,
        error: { message: 'reCAPTCHA error', code: 'RECAPTCHA_ERROR' },
        timestamp: new Date().toISOString(),
      } satisfies ApiResponse);
    }

    try {
      const subscription = await prisma.newsletterSubscription.upsert({
        where: { email },
        update: { status: 'active', updatedAt: new Date() },
        create: {
          email,
          ipAddress: req.ip,
          userAgent: req.get('user-agent') || undefined,
          status: 'active',
          source: source || 'main',
        },
      });

      logger.info('Newsletter subscription saved', { id: subscription.id, email: subscription.email });

      const notifOk = await emailService.sendNewsletterNotification({ email });
      if (notifOk) logger.info('Newsletter notification email sent');
      else logger.warn('Failed to send newsletter notification email');

      const welcomeOk = await emailService.sendNewsletterWelcome({ email });
      if (welcomeOk) logger.info('Newsletter welcome email sent');
      else logger.warn('Failed to send newsletter welcome email');

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Subscription successful' },
        timestamp: new Date().toISOString(),
      };
      return res.status(201).json(response);
    } catch (error) {
      logger.error('Error processing newsletter subscription', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to subscribe. Please try again later.', code: 'INTERNAL_ERROR' },
        timestamp: new Date().toISOString(),
      } satisfies ApiResponse);
    }
  }
);

// Admin endpoints - requieren autenticación
// GET /api/admin/newsletter/subscribers - Obtener todos los suscriptores
router.get('/subscribers', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;

    const where: Record<string, unknown> = {};
    
    if (status && typeof status === 'string') {
      where.status = status;
    }

    const subscribers = await prisma.newsletterSubscription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.newsletterSubscription.count({ where });

    logger.info('Subscribers retrieved', { count: subscribers.length, total });

    res.json({
      success: true,
      data: {
        subscribers,
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    logger.error('Error fetching subscribers', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener suscriptores',
      },
    });
  }
});

// PATCH /api/admin/newsletter/subscribers/:id - Marcar como leído
router.patch('/subscribers/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const subscriber = await prisma.newsletterSubscription.update({
      where: { id },
      data: { isRead: isRead ?? true },
    });

    logger.info('Subscriber marked as read', { id, isRead: subscriber.isRead });

    res.json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    logger.error('Error updating subscriber', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al actualizar suscriptor',
      },
    });
  }
});

// DELETE /api/admin/newsletter/subscribers/:id - Eliminar suscriptor
router.delete('/subscribers/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.newsletterSubscription.delete({
      where: { id },
    });

    logger.info('Subscriber deleted', { id });

    res.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    logger.error('Error deleting subscriber', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al eliminar suscriptor',
      },
    });
  }
});

export default router;
