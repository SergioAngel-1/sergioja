import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { logger } from './lib/logger';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { prisma } from './lib/prisma';

// Routes
import profileRoutes from './routes/profile';
import projectsRoutes from './routes/projects';
import skillsRoutes from './routes/skills';
import contactRoutes from './routes/contact';
import timelineRoutes from './routes/timeline';
import analyticsRoutes from './routes/analytics';
import newsletterRoutes from './routes/newsletter';

dotenv.config();

console.log('Starting server initialization...');

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

console.log(`Port configured: ${PORT}`);
const mask = (url?: string) => (url ? url.replace(/:(?:[^:@/]+)@/, ':****@') : 'undefined');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);
console.log(`DATABASE_URL: ${mask(process.env.DATABASE_URL)}`);

// Middleware
console.log('Setting up middleware...');
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((o) => o.trim());
// Centralized CORS options (includes preflight support)
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// API Routes - Portfolio
console.log('Setting up routes...');
app.use('/api/portfolio/profile', profileRoutes);
app.use('/api/portfolio/projects', projectsRoutes);
app.use('/api/portfolio/skills', skillsRoutes);
app.use('/api/portfolio/contact', contactRoutes);
app.use('/api/portfolio/newsletter', newsletterRoutes);
app.use('/api/portfolio/timeline', timelineRoutes);
app.use('/api/portfolio/analytics', analyticsRoutes);
console.log('Routes configured successfully');

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
// Pre-flight DB connectivity test (non-fatal)
(async () => {
  try {
    console.log('Testing database connectivity...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connectivity: OK');
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
      console.error('Server startup error:', error);
      process.exit(1);
    }
  }
})();

export default app;
