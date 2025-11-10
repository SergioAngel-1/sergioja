import nodemailer from 'nodemailer';
import { appConfig } from '../config/env';
import { logger } from '../lib/logger';
import { contactNotificationTemplate } from './email/templates/contactNotification';
import { contactConfirmationTemplate } from './email/templates/contactConfirmation';

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

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      logger.warn('Email service not available. Email not sent.', {
        to: options.to,
        subject: options.subject,
        reason: 'SMTP credentials not configured'
      });
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: appConfig.email.from || appConfig.email.user,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      logger.info(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email', error);
      return false;
    }
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
}

export const emailService = new EmailService();
