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
  apiError: (method: string, url: string, error: any) => void;
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
    if (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_ENV) {
      return (window as any).NEXT_PUBLIC_ENV !== 'production';
    }
  } catch {}
  return false;
}

const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
let currentLevel: LogLevel = getIsDev() ? 'debug' : 'error';

function shouldLog(level: LogLevel): boolean {
  return levels.indexOf(level) >= levels.indexOf(currentLevel);
}

function baseLog(level: LogLevel, message: string, data?: any, context?: string): void {
  if (!shouldLog(level)) return;
  const ts = new Date().toISOString();
  const ctx = context ? `[${context}] ` : '';
  const text = `${ts} ${level.toUpperCase()} ${ctx}${message}`;
  switch (level) {
    case 'debug':
      // eslint-disable-next-line no-console
      console.debug(text, data ?? '');
      break;
    case 'info':
      // eslint-disable-next-line no-console
      console.info(text, data ?? '');
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(text, data ?? '');
      break;
    case 'error':
      // eslint-disable-next-line no-console
      console.error(text, data ?? '');
      break;
  }
}

export const logger: SharedLogger = {
  debug: (message, data, context) => baseLog('debug', message, data, context),
  info: (message, data, context) => baseLog('info', message, data, context),
  warn: (message, data, context) => baseLog('warn', message, data, context),
  error: (message, error, context) => baseLog('error', message, error, context),
  apiRequest: (method, url, data) => baseLog('debug', `API Request: ${method} ${url}`, data, 'API'),
  apiResponse: (method, url, status, data) => {
    const msg = `API Response: ${method} ${url} - ${status}`;
    if (status >= 400) {
      baseLog('error', msg, data, 'API');
    } else {
      baseLog('debug', msg, data, 'API');
    }
  },
  apiError: (method, url, error) => baseLog('error', `API Error: ${method} ${url}`, error, 'API'),
  navigation: (from, to) => baseLog('debug', `Navigation: ${from} → ${to}`, undefined, 'Navigation'),
  interaction: (action, target, data) => baseLog('debug', `User Interaction: ${action}${target ? ` on ${target}` : ''}`, data, 'Interaction'),
  performance: (metric, value, unit = 'ms') => baseLog('info', `Performance: ${metric} = ${value}${unit}`, undefined, 'Performance'),
};

export function setLoggerAdapter(adapter: Partial<SharedLogger>) {
  Object.assign(logger, adapter);
}
