type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };

    if (this.isDevelopment) {
      const style = this.getStyle(level);
      console.log(`%c[${level.toUpperCase()}]`, style, message, data || '');
    }
  }

  private getStyle(level: LogLevel): string {
    const styles = {
      info: 'color: #00BFFF',
      warn: 'color: #F59E0B',
      error: 'color: #EF4444',
      debug: 'color: #8B00FF',
    };
    return styles[level];
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  // API specific logs
  apiRequest(method: string, url: string, data?: any) {
    this.info(`API ${method} ${url}`, data);
  }

  apiResponse(method: string, url: string, status: number, data?: any) {
    this.info(`API ${method} ${url} - ${status}`, data);
  }

  apiError(method: string, url: string, error: any) {
    this.error(`API ${method} ${url} - Error`, error);
  }
}

export const logger = new Logger();
