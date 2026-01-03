import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { ApiResponse } from '../../../../shared/types';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { verifyRecaptchaEnterprise } from '../../services/recaptchaService';
import { emailService } from '../../services/emailService';
import { authMiddleware } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import { newsletterLimiter } from '../../lib/rateLimit';

const router = Router();

// POST /api/newsletter/subscribe - Suscribirse al newsletter
// Rate limited: 5 suscripciones por hora por dispositivo
router.post(
  '/subscribe',
  newsletterLimiter,
  [body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail()],
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

// Admin endpoints - requieren autenticación
// GET /api/admin/newsletter/subscribers - Obtener todos los suscriptores
router.get('/subscribers', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
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
}));

// PATCH /api/admin/newsletter/subscribers/:id - Marcar como leído
router.patch('/subscribers/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
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
}));

// DELETE /api/admin/newsletter/subscribers/:id - Eliminar suscriptor
router.delete('/subscribers/:id', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.newsletterSubscription.delete({
    where: { id },
  });

  logger.info('Subscriber deleted', { id });

  res.json({
    success: true,
    data: { id },
  });
}));

export default router;
