import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';

// Resolve log level from env to avoid circular deps
// En producción: solo warn y error para reducir overhead
// En desarrollo: info para debugging
const LOG_LEVEL = (process.env.LOG_LEVEL as string) || (isProduction ? 'warn' : 'info');

// Custom log format
const logFormat = printf((info: winston.Logform.TransformableInfo & { timestamp?: string; stack?: string }) => {
  const { level, message, timestamp, stack } = info as any;
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Configuración de transports según entorno
const transports: winston.transport[] = [];

// Console transport (siempre activo, pero con formato optimizado en producción)
if (isProduction) {
  // En producción: JSON format para parsing automático
  transports.push(
    new winston.transports.Console({
      format: combine(timestamp(), json()),
      silent: false, // Mantener logs en consola para Docker
    })
  );
} else {
  // En desarrollo: formato colorizado y legible
  transports.push(
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    })
  );
}

// File transports con rotación automática (solo en producción)
if (isProduction) {
  // Error logs con rotación diaria
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m', // Rotar cuando alcance 20MB
      maxFiles: '14d', // Mantener logs de últimos 14 días
      zippedArchive: true, // Comprimir logs antiguos
    })
  );

  // Combined logs con rotación diaria (solo warn y error)
  transports.push(
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'warn',
      maxSize: '20m',
      maxFiles: '7d', // Mantener logs de últimos 7 días
      zippedArchive: true,
    })
  );
} else {
  // En desarrollo: archivos simples sin rotación
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 3,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 3,
    })
  );
}

// Winston instance
const winstonLogger = winston.createLogger({
  level: LOG_LEVEL,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    isProduction ? json() : logFormat
  ),
  transports,
  // Exception handlers con rotación
  exceptionHandlers: isProduction
    ? [
        new DailyRotateFile({
          filename: 'logs/exceptions-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          zippedArchive: true,
        }),
      ]
    : [new winston.transports.File({ filename: 'logs/exceptions.log' })],
  // Rejection handlers con rotación
  rejectionHandlers: isProduction
    ? [
        new DailyRotateFile({
          filename: 'logs/rejections-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          zippedArchive: true,
        }),
      ]
    : [new winston.transports.File({ filename: 'logs/rejections.log' })],
  // Evitar salida duplicada
  exitOnError: false,
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
