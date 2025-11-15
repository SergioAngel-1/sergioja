import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { ApiResponse } from '../../../shared/types';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { verifyRecaptchaEnterprise } from '../services/recaptchaService';
import { emailService } from '../services/emailService';

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

    const { email, recaptchaToken, recaptchaAction } = req.body as {
      email: string;
      recaptchaToken?: string;
      recaptchaAction?: string;
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
        },
      });

      logger.info('Newsletter subscription saved', { id: subscription.id, email: subscription.email });

      emailService
        .sendNewsletterNotification({ email })
        .then((ok: boolean) => {
          if (ok) logger.info('Newsletter notification email sent');
          else logger.warn('Failed to send newsletter notification email');
        })
        .catch((e: unknown) => logger.error('Newsletter notification send error', e));

      emailService
        .sendNewsletterWelcome({ email })
        .then((ok: boolean) => ok && logger.info('Newsletter welcome email sent'))
        .catch((e: unknown) => logger.error('Newsletter welcome send error', e));

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

export default router;
