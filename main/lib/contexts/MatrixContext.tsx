'use client';

import { ReactNode, useCallback } from 'react';
import { usePerformance } from '@/shared/hooks/usePerformance';

interface MatrixContextType {
  matrixMode: boolean;
  toggleMatrixMode: () => void;
  setMatrixMode: (value: boolean) => void;
}

/**
 * Provider is no longer needed but kept for backward compatibility
 * Matrix mode is now managed by the centralized performance system
 */
export function MatrixProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Hook to use Matrix mode - now integrated with centralized performance system
 */
export function useMatrix(): MatrixContextType {
  const { mode, setMode } = usePerformance();
  
  const setMatrixMode = useCallback((value: boolean) => {
    setMode(value ? 'matrix' : 'high');
  }, [setMode]);

  const toggleMatrixMode = useCallback(() => {
    setMode(mode === 'matrix' ? 'high' : 'matrix');
  }, [mode, setMode]);

  return {
    matrixMode: mode === 'matrix',
    toggleMatrixMode,
    setMatrixMode,
  };
}
