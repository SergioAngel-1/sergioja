import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { logger } from '@/lib/logger';

export function useLogger(componentName: string) {
  const pathname = usePathname();
  const previousPathname = useRef<string>();

  useEffect(() => {
    if (previousPathname.current && previousPathname.current !== pathname) {
      logger.navigation(previousPathname.current, pathname);
    }
    previousPathname.current = pathname;
  }, [pathname]);

  return {
    debug: (message: string, data?: any) => logger.debug(message, data, componentName),
    info: (message: string, data?: any) => logger.info(message, data, componentName),
    warn: (message: string, data?: any) => logger.warn(message, data, componentName),
    error: (message: string, error?: Error | any) => logger.error(message, error, componentName),
    interaction: (action: string, target?: string, data?: any) => logger.interaction(action, target, data),
    performance: (metric: string, value: number, unit?: string) => logger.performance(metric, value, unit),
  };
}

export function usePerformanceLogger(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef<number>();

  useEffect(() => {
    if (!mountTime.current) {
      mountTime.current = performance.now();
      logger.performance(`${componentName} Mount`, mountTime.current);
    }

    renderCount.current += 1;
    logger.debug(`${componentName} rendered (${renderCount.current} times)`, undefined, componentName);

    return () => {
      if (mountTime.current) {
        const lifetime = performance.now() - mountTime.current;
        logger.performance(`${componentName} Lifetime`, lifetime);
      }
    };
  }, [componentName]);

  return renderCount.current;
}
