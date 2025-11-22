import winston from 'winston';
import { appConfig } from '../config/env';
import { logger as sharedLogger, setLoggerAdapter } from '@shared/logger';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf((info: winston.Logform.TransformableInfo & { timestamp?: string; stack?: string }) => {
  const { level, message, timestamp, stack } = info as any;
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logger instance
const winstonLogger = winston.createLogger({
  level: appConfig.logging.level,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

setLoggerAdapter({
  debug: (message, data?, context?) => {
    const ctx = context ? `[${context}] ` : '';
    winstonLogger.debug(`${ctx}${message}`, data);
  },
  info: (message, data?, context?) => {
    const ctx = context ? `[${context}] ` : '';
    winstonLogger.info(`${ctx}${message}`, data);
  },
  warn: (message, data?, context?) => {
    const ctx = context ? `[${context}] ` : '';
    winstonLogger.warn(`${ctx}${message}`, data);
  },
  error: (message, error?, context?) => {
    const ctx = context ? `[${context}] ` : '';
    winstonLogger.error(`${ctx}${message}`, error);
  },
});

export const logger = sharedLogger;

// Stream for Morgan HTTP logger
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
