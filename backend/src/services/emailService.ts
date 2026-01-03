import nodemailer from 'nodemailer';
import { appConfig } from '../config/env';
import { logger } from '../lib/logger';
import { contactNotificationTemplate } from './email/templates/contactNotification';
import { contactConfirmationTemplate } from './email/templates/contactConfirmation';
import { newsletterNotificationTemplate } from './email/templates/newsletterNotification';
import { newsletterWelcomeTemplate } from './email/templates/newsletterWelcome';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Only initialize if SMTP credentials are provided
    if (!appConfig.email.host || !appConfig.email.user || !appConfig.email.pass) {
      logger.warn('Email service not configured. SMTP credentials missing.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: appConfig.email.host,
        port: appConfig.email.port || 587,
        secure: appConfig.email.port === 465, // true for 465, false for other ports
        auth: {
          user: appConfig.email.user,
          pass: appConfig.email.pass,
        },
      });

      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email service', error);
    }
  }

  async sendEmail(options: EmailOptions, retries: number = 3): Promise<boolean> {
    if (!this.transporter) {
      logger.warn('Email service not available. Email not sent.', {
        to: options.to,
        subject: options.subject,
        reason: 'SMTP credentials not configured'
      });
      return false;
    }

    const fromAddress = appConfig.email.fromName 
      ? `"${appConfig.email.fromName}" <${appConfig.email.from || appConfig.email.user}>`
      : appConfig.email.from || appConfig.email.user;

    // Retry logic con exponential backoff
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const info = await this.transporter.sendMail({
          from: fromAddress,
          to: options.to,
          subject: options.subject,
          text: options.text,
          html: options.html,
        });

        logger.info(`Email sent successfully: ${info.messageId}`, {
          to: options.to,
          subject: options.subject,
          attempt,
        });
        return true;
      } catch (error: any) {
        const isLastAttempt = attempt === retries;
        
        logger.error(`Email send attempt ${attempt}/${retries} failed`, {
          to: options.to,
          subject: options.subject,
          error: error.message,
          code: error.code,
        });

        if (isLastAttempt) {
          // En el último intento, loguear error crítico
          logger.error('All email send attempts failed', {
            to: options.to,
            subject: options.subject,
            totalAttempts: retries,
            finalError: error.message,
          });
          return false;
        }

        // Exponential backoff: 1s, 2s, 4s
        const backoffMs = Math.pow(2, attempt - 1) * 1000;
        logger.info(`Retrying email send in ${backoffMs}ms...`, {
          attempt: attempt + 1,
          maxAttempts: retries,
        });
        
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }

    return false;
  }

  async sendContactNotification(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<boolean> {
    const { html, text } = contactNotificationTemplate(data);

    // Enviar a contact@sergioja.com (configurado en SMTP_USER)
    return this.sendEmail({
      to: appConfig.email.user || 'contact@sergioja.com',
      subject: `Portfolio Contact: ${data.subject}`,
      text,
      html,
    });
  }

  async sendConfirmationEmail(data: {
    name: string;
    email: string;
  }): Promise<boolean> {
    const { html, text } = contactConfirmationTemplate(data);

    return this.sendEmail({
      to: data.email,
      subject: '✓ Gracias por contactarme - Sergio Jáuregui',
      text,
      html,
    });
  }

  async sendNewsletterNotification(data: { email: string }): Promise<boolean> {
    const { html, text } = newsletterNotificationTemplate({ email: data.email });

    return this.sendEmail({
      to: appConfig.email.user || 'contact@sergioja.com',
      subject: 'New Newsletter Subscriber',
      text,
      html,
    });
  }

  async sendNewsletterWelcome(data: { email: string }): Promise<boolean> {
    const { html, text } = newsletterWelcomeTemplate({ email: data.email });

    return this.sendEmail({
      to: data.email,
      subject: 'Welcome to the Newsletter - Sergio Jáuregui',
      text,
      html,
    });
  }
}

export const emailService = new EmailService();
