import { useMemo } from 'react';

/**
 * Hook compartido para detectar si el dispositivo es mobile
 * Evita duplicación de regex y mantiene consistencia
 */
export function useIsMobile(): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);
}
