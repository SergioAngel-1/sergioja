'use client';

import { useEffect } from 'react';
import { useWebVitals } from '@/shared/webVitals';
import { logger } from '@/shared/logger';

/**
 * Client component para inicializar Web Vitals tracking
 * Debe ser usado en el layout como componente hijo
 */
export default function WebVitalsTracker() {
  useEffect(() => {
    useWebVitals(logger);
  }, []);

  return null;
}
