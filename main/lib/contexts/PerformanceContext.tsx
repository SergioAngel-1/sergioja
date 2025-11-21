'use client';

import { ReactNode } from 'react';

/**
 * Main Performance Context - Wrapper over shared performance system
 * Re-exports the shared hook for use in Main
 */
export { usePerformance } from '@/shared/hooks/usePerformance';

/**
 * Provider is no longer needed but kept for backward compatibility
 * The shared system manages state globally
 */
export function PerformanceProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
