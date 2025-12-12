import { trackError } from './analytics';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  context?: string;
}

export interface SharedLogger {
  debug: (message: string, data?: any, context?: string) => void;
  info: (message: string, data?: any, context?: string) => void;
  warn: (message: string, data?: any, context?: string) => void;
  error: (message: string, error?: any, context?: string) => void;
  apiRequest: (method: string, url: string, data?: any) => void;
  apiResponse: (method: string, url: string, status: number, data?: any) => void;
  apiError: (method: string, url: string, error?: any) => void;
  navigation: (from: string, to: string) => void;
  interaction: (action: string, target?: string, data?: any) => void;
  performance: (metric: string, value: number, unit?: string) => void;
}

function getIsDev(): boolean {
  try {
    if (typeof process !== 'undefined' && process.env && typeof process.env.NODE_ENV === 'string') {
      return process.env.NODE_ENV !== 'production';
    }
  } catch {}
  try {
    const g: any = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    if (g && g.NEXT_PUBLIC_ENV) {
      return g.NEXT_PUBLIC_ENV !== 'production';
    }
  } catch {}
  return false;
}

const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
// En desarrollo: mostrar todo (debug)
// En producción: solo errores críticos (error)
let currentLevel: LogLevel = getIsDev() ? 'debug' : 'error';

const ENABLE_API_DEBUG =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DEBUG_API === 'true';

/**
 * Lista de errores conocidos que se deben ignorar en producción
 * 
 * Estos errores son esperados y no requieren logging en producción:
 * - recaptcha: 401 Unauthorized es normal cuando reCAPTCHA valida tokens
 * - Failed to fetch: Errores de red comunes (usuario sin conexión, etc.)
 * 
 * En desarrollo, TODOS los errores se muestran para debugging.
 */
const IGNORED_ERRORS_PRODUCTION = [
  'recaptcha',
  'Failed to fetch',
];

/**
 * Verifica si un error debe ser ignorado en producción
 */
function shouldIgnoreError(message: string, error?: any): boolean {
  if (getIsDev()) return false; // En desarrollo, mostrar todos los errores
  
  const errorString = (message || '').toString().toLowerCase();
  const errorDataString = error ? (error.toString ? error.toString() : JSON.stringify(error)).toLowerCase() : '';
  
  return IGNORED_ERRORS_PRODUCTION.some(pattern => 
    errorString.includes(pattern) || errorDataString.includes(pattern)
  );
}

function shouldLog(level: LogLevel): boolean {
  return levels.indexOf(level) >= levels.indexOf(currentLevel);
}

function baseLog(level: LogLevel, message: string, data: any = {}, context?: string): void {
  if (!shouldLog(level)) return;
  const ts = new Date().toISOString();
  const ctx = context ? `[${context}] ` : '';
  const text = `${ts} ${level.toUpperCase()} ${ctx}${message}`;
  
  // Solo mostrar data si no está vacío
  const hasData = data && Object.keys(data).length > 0;
  
  switch (level) {
    case 'debug':
      // eslint-disable-next-line no-console
      if (hasData) console.debug(text, data);
      else console.debug(text);
      break;
    case 'info':
      // eslint-disable-next-line no-console
      if (hasData) console.info(text, data);
      else console.info(text);
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      if (hasData) console.warn(text, data);
      else console.warn(text);
      break;
    case 'error':
      // eslint-disable-next-line no-console
      if (hasData) console.error(text, data);
      else console.error(text);
      
      // Track error en GA4 (solo en producción para evitar ruido)
      if (!getIsDev() && typeof window !== 'undefined') {
        const source = getSourceFromContext(context);
        const errorType = data?.name || data?.type || 'UnknownError';
        const errorStack = data?.stack || (data instanceof Error ? data.stack : undefined);
        trackError(source, errorType, message, errorStack, context);
      }
      break;
  }
}

/**
 * Extrae el source del contexto o usa un default
 */
function getSourceFromContext(context?: string): string {
  if (!context) return 'unknown';
  
  const lowerContext = context.toLowerCase();
  if (lowerContext.includes('portfolio')) return 'portfolio';
  if (lowerContext.includes('main')) return 'main';
  if (lowerContext.includes('admin')) return 'admin';
  
  return 'shared';
}

export const logger: SharedLogger = {
  debug: (message, data?, context?) => baseLog('debug', message, data, context),
  info: (message, data?, context?) => baseLog('info', message, data, context),
  warn: (message, data?, context?) => baseLog('warn', message, data, context),
  error: (message, error?, context?) => {
    // Filtrar errores conocidos en producción
    if (shouldIgnoreError(message, error)) return;
    baseLog('error', message, error, context);
  },
  apiRequest: (method, url, data?) => {
    if (ENABLE_API_DEBUG) {
      baseLog('debug', `API Request: ${method} ${url}`, data, 'API');
    }
  },
  apiResponse: (method, url, status, data?) => {
    const msg = `API Response: ${method} ${url} - ${status}`;
    if (status >= 400) {
      // Filtrar errores de API conocidos en producción
      if (shouldIgnoreError(msg, data)) return;
      baseLog('error', msg, data, 'API');
    } else {
      if (ENABLE_API_DEBUG) {
        baseLog('debug', msg, data, 'API');
      }
    }
  },
  apiError: (method, url, error?) => {
    const msg = `API Error: ${method} ${url}`;
    // Filtrar errores de API conocidos en producción
    if (shouldIgnoreError(msg, error)) return;
    baseLog('error', msg, error, 'API');
    
    // Track API error específicamente en GA4
    if (!getIsDev() && typeof window !== 'undefined') {
      const source = getSourceFromContext('API');
      const errorType = 'APIError';
      const errorMessage = `${method} ${url}: ${error?.message || 'Unknown error'}`;
      const errorStack = error?.stack;
      trackError(source, errorType, errorMessage, errorStack, 'API');
    }
  },
  navigation: (from, to) => baseLog('debug', `Navigation: ${from} → ${to}`, undefined, 'Navigation'),
  interaction: (action, target?, data?) => baseLog('debug', `User Interaction: ${action}${target ? ` on ${target}` : ''}`, data, 'Interaction'),
  performance: (metric, value, unit = 'ms') => baseLog('info', `Performance: ${metric} = ${value}${unit}`, undefined, 'Performance'),
};

export function setLoggerAdapter(adapter: Partial<SharedLogger>) {
  Object.assign(logger, adapter);
}
