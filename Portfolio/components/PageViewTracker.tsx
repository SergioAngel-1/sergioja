'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { logger } from '@/lib/logger';

/**
 * Client component para tracking automático de page views
 * Trackea cada navegación y envía datos al backend
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Construir path completo con query params si existen
      const fullPath = searchParams?.toString() 
        ? `${pathname}?${searchParams.toString()}` 
        : pathname;
      
      // Track page view (envía a GTM y backend)
      trackPageView(fullPath, document.title);
      
      logger.info('Page view tracked', { path: fullPath, title: document.title });
    }
  }, [pathname, searchParams]);

  return null;
}
