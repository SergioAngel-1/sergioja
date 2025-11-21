import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { logger } from '../logger';

/**
 * Hook to use logger with automatic component context
 * @param componentName - Name of the component using the logger
 */
export function useLogger(componentName: string) {
  const pathname = usePathname();
  const previousPathname = useRef<string>();

  // Log navigation changes
  useEffect(() => {
    if (previousPathname.current && previousPathname.current !== pathname) {
      logger.navigation(previousPathname.current, pathname);
    }
    previousPathname.current = pathname;
  }, [pathname]);

  // Return logger methods with component context
  return {
    debug: (message: string, data?: any) => 
      logger.debug(message, data, componentName),
    
    info: (message: string, data?: any) => 
      logger.info(message, data, componentName),
    
    warn: (message: string, data?: any) => 
      logger.warn(message, data, componentName),
    
    error: (message: string, error?: Error | any) => 
      logger.error(message, error, componentName),
    
    interaction: (action: string, target?: string, data?: any) => 
      logger.interaction(action, target, data),
    
    performance: (metric: string, value: number, unit?: string) => 
      logger.performance(metric, value, unit),
  };
}

/**
 * Hook to measure component render performance
 * @param componentName - Name of the component
 */
export function usePerformanceLogger(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef<number>();

  useEffect(() => {
    // Log mount time
    if (!mountTime.current) {
      mountTime.current = performance.now();
      logger.performance(`${componentName} Mount`, mountTime.current);
    }

    // Increment render count
    renderCount.current += 1;
    logger.debug(`${componentName} rendered (${renderCount.current} times)`, undefined, componentName);

    // Log unmount
    return () => {
      if (mountTime.current) {
        const lifetime = performance.now() - mountTime.current;
        logger.performance(`${componentName} Lifetime`, lifetime);
      }
    };
  }, [componentName]);

  return renderCount.current;
}
