'use client';

import { useEffect } from 'react';
import { useWebVitals } from '@/shared/seo/webVitals';
import { logger } from '@/shared/logger';

export default function WebVitalsTracker() {
  useEffect(() => {
    useWebVitals(logger);
  }, []);

  return null;
}
