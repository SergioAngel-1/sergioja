import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment schema validation
const envSchema = z.object({
  // Server
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Frontend
  FRONTEND_URL: z.string().url().optional(),
  FRONTEND_URLS: z.string().optional(),
  
  // Database
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters').optional(),
  
  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  SMTP_FROM_NAME: z.string().optional(),
  SMTP_ENCRYPTION: z.enum(['tls', 'ssl']).optional(),

  // reCAPTCHA Enterprise (optional)
  RECAPTCHA_ENTERPRISE_PROJECT_ID: z.string().optional(),
  RECAPTCHA_ENTERPRISE_API_KEY: z.string().optional(),
  RECAPTCHA_ENTERPRISE_SERVICE_ACCOUNT: z.string().optional(),
  RECAPTCHA_SITE_KEY: z.string().optional(),
  RECAPTCHA_MIN_SCORE: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Validate and parse environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err: z.ZodIssue) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();

// Export typed configuration
export const appConfig = {
  server: {
    port: parseInt(env.PORT, 10),
    env: env.NODE_ENV,
    frontendUrl: env.FRONTEND_URL,
  },
  database: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : undefined,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM,
    fromName: env.SMTP_FROM_NAME,
    encryption: env.SMTP_ENCRYPTION,
  },
  recaptcha: {
    projectId: env.RECAPTCHA_ENTERPRISE_PROJECT_ID,
    apiKey: env.RECAPTCHA_ENTERPRISE_API_KEY,
    serviceAccountKey: env.RECAPTCHA_ENTERPRISE_SERVICE_ACCOUNT,
    siteKey: env.RECAPTCHA_SITE_KEY,
    minScore: env.RECAPTCHA_MIN_SCORE ? parseFloat(env.RECAPTCHA_MIN_SCORE) : 0.5,
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  logging: {
    level: env.LOG_LEVEL,
  },
} as const;
