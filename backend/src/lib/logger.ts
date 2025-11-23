import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Resolve log level from env to avoid circular deps
const LOG_LEVEL = (process.env.LOG_LEVEL as string) || 'info';

// Custom log format
const logFormat = printf((info: winston.Logform.TransformableInfo & { timestamp?: string; stack?: string }) => {
  const { level, message, timestamp, stack } = info as any;
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Winston instance
const winstonLogger = winston.createLogger({
  level: LOG_LEVEL,
  format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new winston.transports.Console({ format: combine(colorize(), logFormat) }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.File({ filename: 'logs/combined.log', maxsize: 5242880, maxFiles: 5 }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
});

// Minimal logger used across backend
export const logger = {
  debug: (message: string, data?: any, context?: string) => {
    const ctx = context ? `[${context}] ` : '';
    winstonLogger.debug(`${ctx}${message}`, data);
  },
  info: (message: string, data?: any, context?: string) => {
    const ctx = context ? `[${context}] ` : '';
    winstonLogger.info(`${ctx}${message}`, data);
  },
  warn: (message: string, data?: any, context?: string) => {
    const ctx = context ? `[${context}] ` : '';
    winstonLogger.warn(`${ctx}${message}`, data);
  },
  error: (message: string, error?: any, context?: string) => {
    const ctx = context ? `[${context}] ` : '';
    winstonLogger.error(`${ctx}${message}`, error);
  },
};

// Stream for Morgan HTTP logger
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
