/**
 * Hook de React para el sistema de rendimiento centralizado
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  PerformanceManager, 
  PerformanceConfig, 
  PerformanceMode,
  getPerformanceManager 
} from '../performanceSystem';
import { logger } from '../logger';

/**
 * Hook para usar el sistema de rendimiento en componentes React
 */
export function usePerformance() {
  const [manager] = useState(() => getPerformanceManager());
  // IMPORTANT: Use the SAME initial state for SSR and the first client render to avoid hydration mismatches.
  // Initialize with a static high-performance preset, then load the real config in useEffect after mount.
  const [config, setConfig] = useState<PerformanceConfig>(() => ({
    mode: 'high',
    enableAnimations: true,
    enableParticles: true,
    enableBlur: true,
    enableShadows: true,
    reducedMotion: false,
  }));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Cargar config del manager una vez montado en el cliente
    const clientConfig = manager.getConfig();
    setConfig(clientConfig);

    logger.debug('usePerformance hook mounted', { mode: clientConfig.mode }, 'Performance');

    // Suscribirse a cambios
    const unsubscribe = manager.subscribe((newConfig) => {
      logger.debug('Performance config updated in hook', newConfig, 'Performance');
      setConfig(newConfig);
    });

    return () => {
      logger.debug('usePerformance hook unmounted', undefined, 'Performance');
      unsubscribe();
    };
  }, [manager]);

  const setMode = useCallback((mode: PerformanceMode) => {
    manager.setMode(mode);
  }, [manager]);

  const toggleMode = useCallback(() => {
    manager.toggleMode();
  }, [manager]);

  const updateConfig = useCallback((partial: Partial<PerformanceConfig>) => {
    manager.updateConfig(partial);
  }, [manager]);

  const isEnabled = useCallback((feature: keyof Omit<PerformanceConfig, 'mode'>) => {
    return manager.isEnabled(feature);
  }, [manager]);

  return {
    config,
    mode: config.mode,
    setMode,
    toggleMode,
    updateConfig,
    isEnabled,
    // Aliases para compatibilidad
    lowPerformanceMode: config.mode === 'low',
    matrixMode: config.mode === 'matrix',
    highPerformanceMode: config.mode === 'high',
  };
}

/**
 * Hook para detectar capacidades del dispositivo
 */
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState(() => 
    PerformanceManager.detectDeviceCapabilities()
  );

  useEffect(() => {
    // Re-detectar en mount (por si cambió algo)
    const detected = PerformanceManager.detectDeviceCapabilities();
    setCapabilities(detected);
    
    logger.info('Device capabilities detected in hook', detected, 'Performance');
  }, []);

  return capabilities;
}

/**
 * Hook para aplicar modo recomendado automáticamente
 */
export function useRecommendedPerformance(autoApply: boolean = false) {
  const { setMode } = usePerformance();
  const capabilities = useDeviceCapabilities();

  useEffect(() => {
    if (autoApply) {
      const recommended = PerformanceManager.recommendMode();
      logger.info('Auto-applying recommended performance mode', { recommended }, 'Performance');
      setMode(recommended);
    }
  }, [autoApply, setMode]);

  return {
    capabilities,
    recommendedMode: PerformanceManager.recommendMode(),
  };
}
