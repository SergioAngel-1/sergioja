import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { logger } from './lib/logger';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { prisma } from './lib/prisma';
import { cleanupExpiredTokens } from './services/authService';

// Routes - Admin
import authRoutes from './routes/admin/auth';
import dashboardRoutes from './routes/admin/dashboard';
import messagesRoutes from './routes/admin/messages';
import categoriesRoutes from './routes/admin/categories';
import adminProjectsRoutes from './routes/admin/projects';
import adminCvRoutes from './routes/admin/cv';

// Routes - Portfolio
import profileRoutes from './routes/portfolio/profile';
import cvRoutes from './routes/portfolio/cv';
import skillsRoutes from './routes/portfolio/skills';
import contactRoutes from './routes/portfolio/contact';
import portfolioProjectsRoutes from './routes/portfolio/projects';
import portfolioCategoriesRoutes from './routes/portfolio/categories';

// Routes - Shared
import analyticsRoutes from './routes/shared/analytics';
import newsletterRoutes from './routes/shared/newsletter';

dotenv.config();

logger.info('Starting server initialization...');

// Extra diagnostics
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('UnhandledRejection', reason as any);
});
process.on('uncaughtException', (err: Error) => {
  logger.error('UncaughtException', err);
});

const app: Application = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

logger.info(`Port configured: ${PORT}`);
const mask = (url?: string) => (url ? url.replace(/:(?:[^:@/]+)@/, ':****@') : 'undefined');
logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);
logger.info(`DATABASE_URL: ${mask(process.env.DATABASE_URL)}`);

// Middleware
logger.info('Setting up middleware...');
// Early CORS preflight handler to guarantee headers on OPTIONS
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string | undefined;
  if (origin) {
    try {
      const host = new URL(origin).hostname;
      const allowList = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:3001,http://localhost:3002')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
      const originAllowed = allowList.includes(origin) || /(^|\.)sergioja\.com$/.test(host);
      if (originAllowed) {
        const acrh = (req.headers['access-control-request-headers'] as string | undefined) || 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Language, Origin';
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', acrh);
        if (req.method === 'OPTIONS') {
          return res.status(204).end();
        }
      }
    } catch {}
  }
  next();
});
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:3001,http://localhost:3002')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    try {
      const u = new URL(origin);
      if (/(^|\.)sergioja\.com$/.test(u.hostname)) return callback(null, true);
    } catch {}
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Accept-Language', 'Origin'],
  optionsSuccessStatus: 200,
};
app.use((req: Request, res: Response, next: NextFunction) => {
  const xfh = req.headers['x-forwarded-host'];
  const host = (Array.isArray(xfh) ? xfh[0] : xfh) || req.headers.host || '';
  if (typeof host === 'string' && host.startsWith('www.')) {
    const destHost = host.replace(/^www\./, '');
    return res.redirect(301, `https://${destHost}${req.url}`);
  }
  next();
});
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
// Handle CORS preflight requests
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Aumentar límite para imágenes en base64
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // Aumentado para desarrollo
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting en desarrollo
    return process.env.NODE_ENV === 'development';
  },
});

app.use('/api/', limiter);

// Request logging
app.use(requestLogger);

// Health check
const healthResponse = (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

app.get('/', healthResponse);
app.get('/health', healthResponse);

// API Routes
logger.info('Setting up routes...');
// Admin routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/messages', messagesRoutes);
app.use('/api/admin/newsletter', newsletterRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/projects', adminProjectsRoutes);
app.use('/api/admin/categories', categoriesRoutes);
app.use('/api/admin/cv', adminCvRoutes);
// Portfolio routes
app.use('/api/portfolio/profile', profileRoutes);
app.use('/api/portfolio/cv', cvRoutes);
app.use('/api/portfolio/projects', portfolioProjectsRoutes);
app.use('/api/portfolio/skills', skillsRoutes);
app.use('/api/portfolio/contact', contactRoutes);
app.use('/api/portfolio/newsletter', newsletterRoutes);
app.use('/api/portfolio/analytics', analyticsRoutes);
app.use('/api/categories', portfolioCategoriesRoutes); // Rutas públicas de categorías
logger.info('Routes configured successfully');

setInterval(() => {
  cleanupExpiredTokens().catch((err: any) => logger.error('Token cleanup error', err));
}, 21600000);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
// Pre-flight DB connectivity test (non-fatal)
(async () => {
  try {
    logger.info('Testing database connectivity...');
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connectivity: OK');
  } catch (err) {
    logger.error('Database connectivity failed', err as any);
  } finally {
    try {
      app.listen(PORT, () => {
        logger.info(`🚀 Backend server running on http://localhost:${PORT}`);
        logger.info(`📊 Health check: http://localhost:${PORT}/health`);
        logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      logger.error('Failed to start server', error as any);
      logger.error('Server startup error', error);
      process.exit(1);
    }
  }
})();

export default app;
