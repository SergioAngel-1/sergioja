'use client';

import { useWebVitals } from '@/shared/seo/webVitals';
import { logger } from '@/shared/logger';

export default function WebVitalsTracker() {
  useWebVitals(logger);
  return null;
}
