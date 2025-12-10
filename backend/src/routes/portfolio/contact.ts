import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { ApiResponse, ContactSubmissionPayload } from '../../../../shared/types';
import { emailService } from '../../services/emailService';
import { logger } from '../../lib/logger';
import { prisma } from '../../lib/prisma';
import { verifyRecaptchaEnterprise } from '../../services/recaptchaService';

const router = Router();

// POST /api/contact - Submit contact form
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  ],
  async (req: Request, res: Response) => {
    // Validate input
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
      });
    }

    const formData: ContactSubmissionPayload = req.body;

    // Verify reCAPTCHA Enterprise token if present (required in production)
    try {
      const token = formData.recaptchaToken;
      const expectedAction = formData.recaptchaAction || 'submit_contact';
      const { valid, score, reasons } = await verifyRecaptchaEnterprise(token || '', expectedAction);
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
      logger.error('reCAPTCHA verification error', err as any);
      return res.status(400).json({
        success: false,
        error: { message: 'reCAPTCHA error', code: 'RECAPTCHA_ERROR' },
        timestamp: new Date().toISOString(),
      } satisfies ApiResponse);
    }

    try {
      // Save to database
      const submission = await prisma.contactSubmission.create({
        data: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          status: 'new',
        },
      });

      logger.info('Contact form submission saved', {
        id: submission.id,
        name: formData.name,
        email: formData.email,
      });

      // Send notification email to yourself
      const notificationSent = await emailService.sendContactNotification(formData);
      
      if (notificationSent) {
        logger.info('Contact notification email sent successfully');
      } else {
        logger.warn('Failed to send contact notification email');
      }

      // Send confirmation email to user
      const confirmationSent = await emailService.sendConfirmationEmail({
        name: formData.name,
        email: formData.email,
      });

      if (confirmationSent) {
        logger.info('Confirmation email sent to user');
      }

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: {
          message: 'Thank you for your message! I will get back to you soon.',
        },
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Error processing contact form', error);
      
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to process your message. Please try again later.',
          code: 'INTERNAL_ERROR',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export default router;
