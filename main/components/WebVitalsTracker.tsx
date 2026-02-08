'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/shared/seo/webVitals';
import { logger } from '@/shared/logger';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

/**
 * Client component para inicializar Web Vitals tracking
 * Solo se activa cuando el usuario ha aceptado cookies
 */
export default function WebVitalsTracker() {
  const { hasConsent } = useCookieConsent();

  useEffect(() => {
    if (hasConsent) {
      initWebVitals(logger);
    }
  }, [hasConsent]);

  return null;
}
