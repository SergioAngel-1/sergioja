import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { ApiResponse, ContactSubmissionPayload } from '../../../../shared/types';
import { emailService } from '../../services/emailService';
import { logger } from '../../lib/logger';
import { prisma } from '../../lib/prisma';
import { verifyRecaptchaEnterprise } from '../../services/recaptchaService';
import { asyncHandler } from '../../middleware/errorHandler';
import { contactLimiter } from '../../lib/rateLimit';

const router = Router();

// POST /api/contact - Submit contact form
// Rate limited: 5 mensajes por hora por dispositivo
router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters'),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
  ],
  asyncHandler(async (req: Request, res: Response) => {
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

    // Responder inmediatamente al usuario (no esperar emails)
    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: {
        message: 'Thank you for your message! I will get back to you soon.',
      },
      timestamp: new Date().toISOString(),
    };

    res.status(201).json(response);

    // Enviar emails en background (no bloquea response)
    // Si fallan después de 3 intentos, solo se loguea el error
    Promise.all([
      emailService.sendContactNotification(formData).then(sent => {
        if (sent) {
          logger.info('Contact notification email sent successfully');
        } else {
          logger.error('Failed to send contact notification email after all retries', {
            submissionId: submission.id,
            email: formData.email,
          });
        }
      }),
      emailService.sendConfirmationEmail({
        name: formData.name,
        email: formData.email,
      }).then(sent => {
        if (sent) {
          logger.info('Confirmation email sent to user');
        } else {
          logger.error('Failed to send confirmation email after all retries', {
            submissionId: submission.id,
            userEmail: formData.email,
          });
        }
      }),
    ]).catch(err => {
      logger.error('Unexpected error in background email sending', {
        error: err,
        submissionId: submission.id,
      });
    });
  })
);

export default router;
