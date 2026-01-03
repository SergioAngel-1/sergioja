'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { logger } from '@/lib/logger';

/**
 * Client component para tracking automático de page views
 * Trackea cada navegación y envía datos al backend
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      // Construir path completo con query params desde window.location
      const fullPath = typeof window !== 'undefined' && window.location.search
        ? `${pathname}${window.location.search}` 
        : pathname;
      
      // Track page view (envía a GTM y backend)
      trackPageView(fullPath, typeof document !== 'undefined' ? document.title : '');
      
      logger.info('Page view tracked', { path: fullPath, title: typeof document !== 'undefined' ? document.title : '' });
    }
  }, [pathname]);

  return null;
}
