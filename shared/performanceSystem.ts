/**
 * Sistema de rendimiento centralizado
 * Gestiona modos de rendimiento y preferencias del usuario
 */

import { logger } from './logger';

export type PerformanceMode = 'high' | 'low' | 'matrix';

export interface PerformanceConfig {
  mode: PerformanceMode;
  enableAnimations: boolean;
  enableParticles: boolean;
  enableBlur: boolean;
  enableShadows: boolean;
  reducedMotion: boolean;
}

/**
 * Configuraciones predefinidas por modo
 */
export const PERFORMANCE_PRESETS: Record<PerformanceMode, PerformanceConfig> = {
  high: {
    mode: 'high',
    enableAnimations: true,
    enableParticles: true,
    enableBlur: true,
    enableShadows: true,
    reducedMotion: false,
  },
  low: {
    mode: 'low',
    enableAnimations: false,
    enableParticles: false,
    enableBlur: false,
    enableShadows: false,
    reducedMotion: true,
  },
  matrix: {
    mode: 'matrix',
    enableAnimations: true,
    enableParticles: true,
    enableBlur: true,
    enableShadows: true,
    reducedMotion: false,
  },
};

/**
 * Clase para gestionar el sistema de rendimiento
 */
export class PerformanceManager {
  private config: PerformanceConfig;
  private storageKey: string;
  private listeners: Set<(config: PerformanceConfig) => void>;
  private frontend: 'main' | 'portfolio';

  constructor(storageKey: string = 'performance-config', frontend: 'main' | 'portfolio' = 'portfolio') {
    this.storageKey = storageKey;
    this.frontend = frontend;
    this.listeners = new Set();
    this.config = this.loadConfig();
    
    logger.info('PerformanceManager initialized', { 
      mode: this.config.mode,
      storageKey,
      frontend
    }, 'Performance');
  }

  /**
   * Cargar configuración desde localStorage
   */
  private loadConfig(): PerformanceConfig {
    if (typeof window === 'undefined') {
      return PERFORMANCE_PRESETS.high;
    }

    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as PerformanceConfig;
        logger.debug('Performance config loaded from storage', parsed, 'Performance');
        return parsed;
      }
    } catch (error) {
      logger.error('Error loading performance config', error, 'Performance');
    }

    // Si no hay preferencia guardada, detectar automáticamente el modo recomendado
    logger.info('No saved preference, detecting device capabilities', undefined, 'Performance');
    const recommendedMode = PerformanceManager.recommendMode(this.frontend);
    const config = PERFORMANCE_PRESETS[recommendedMode];
    
    // Guardar la detección automática para futuras visitas
    this.config = config;
    this.saveConfig();
    
    return config;
  }

  /**
   * Guardar configuración en localStorage
   */
  private saveConfig(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.config));
      logger.debug('Performance config saved to storage', this.config, 'Performance');
    } catch (error) {
      logger.error('Error saving performance config', error, 'Performance');
    }
  }

  /**
   * Obtener configuración actual
   */
  getConfig(): PerformanceConfig {
    return { ...this.config };
  }

  /**
   * Obtener modo actual
   */
  getMode(): PerformanceMode {
    return this.config.mode;
  }

  /**
   * Establecer modo de rendimiento
   */
  setMode(mode: PerformanceMode): void {
    logger.info(`Setting performance mode: ${mode}`, { from: this.config.mode, to: mode }, 'Performance');
    
    this.config = PERFORMANCE_PRESETS[mode];
    this.saveConfig();
    this.notifyListeners();
  }

  /**
   * Alternar entre modos high y low
   */
  toggleMode(): void {
    const newMode = this.config.mode === 'high' ? 'low' : 'high';
    this.setMode(newMode);
  }

  /**
   * Actualizar configuración personalizada
   */
  updateConfig(partial: Partial<PerformanceConfig>): void {
    logger.debug('Updating performance config', partial, 'Performance');
    
    this.config = { ...this.config, ...partial };
    this.saveConfig();
    this.notifyListeners();
  }

  /**
   * Verificar si una característica está habilitada
   */
  isEnabled(feature: keyof Omit<PerformanceConfig, 'mode'>): boolean {
    return this.config[feature];
  }

  /**
   * Suscribirse a cambios de configuración
   */
  subscribe(listener: (config: PerformanceConfig) => void): () => void {
    this.listeners.add(listener);
    logger.debug('Performance listener subscribed', { totalListeners: this.listeners.size }, 'Performance');
    
    return () => {
      this.listeners.delete(listener);
      logger.debug('Performance listener unsubscribed', { totalListeners: this.listeners.size }, 'Performance');
    };
  }

  /**
   * Notificar a todos los listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getConfig());
      } catch (error) {
        logger.error('Error in performance listener', error, 'Performance');
      }
    });
  }

  /**
   * Detectar capacidades del dispositivo
   */
  static detectDeviceCapabilities(): {
    isMobile: boolean;
    isLowEnd: boolean;
    prefersReducedMotion: boolean;
    hasGPU: boolean;
    cpuCores: number;
    deviceMemory: number | undefined;
    lowEndReasons: string[];
  } {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isLowEnd: false,
        prefersReducedMotion: false,
        hasGPU: false,
        cpuCores: 0,
        deviceMemory: undefined,
        lowEndReasons: [],
      };
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detectar GPU (aproximado)
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasGPU = !!gl;

    // Detectar CPU cores
    const cpuCores = navigator.hardwareConcurrency || 0;
    
    // Detectar memoria del dispositivo (solo en Chrome/Edge)
    const deviceMemory = (navigator as any).deviceMemory;

    // Detectar dispositivos de gama baja con criterios muy relajados
    // NO consideramos prefers-reduced-motion para evitar falsos positivos
    const lowEndReasons = [];
    
    if (isMobile && cpuCores > 0 && cpuCores <= 2) {
      lowEndReasons.push('mobile_low_cores');
    }
    if (deviceMemory !== undefined && deviceMemory <= 2) {
      lowEndReasons.push('low_memory');
    }
    
    const isLowEnd = lowEndReasons.length > 0;

    const capabilities = { 
      isMobile, 
      isLowEnd, 
      prefersReducedMotion, 
      hasGPU, 
      cpuCores,
      deviceMemory,
      lowEndReasons
    };
    logger.info('Device capabilities detected', capabilities, 'Performance');

    return capabilities;
  }

  /**
   * Recomendar modo basado en capacidades del dispositivo
   * @param frontend - 'main' para Main (más exigente), 'portfolio' para Portfolio (menos exigente)
   */
  static recommendMode(frontend: 'main' | 'portfolio' = 'portfolio'): PerformanceMode {
    const capabilities = PerformanceManager.detectDeviceCapabilities();

    // Main es más exigente (modelo 3D, más animaciones)
    // Portfolio es menos exigente
    const threshold = frontend === 'main' ? 1 : 0;
    
    const shouldUseLowMode = capabilities.lowEndReasons.length > threshold;

    if (shouldUseLowMode) {
      logger.info(`Recommending low performance mode for ${frontend}`, capabilities, 'Performance');
      return 'low';
    }

    logger.info(`Recommending high performance mode for ${frontend}`, capabilities, 'Performance');
    return 'high';
  }
}

/**
 * Instancia singleton del manager (para uso fuera de React)
 */
let globalManager: PerformanceManager | null = null;

/**
 * Detectar automáticamente el frontend basándose en la URL
 */
function detectFrontend(): 'main' | 'portfolio' {
  if (typeof window === 'undefined') return 'portfolio';
  
  // Detectar por hostname o pathname
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Si la URL contiene 'portfolio' o está en puerto 3001
  if (hostname.includes('portfolio') || window.location.port === '3001') {
    return 'portfolio';
  }
  
  // Si la URL contiene 'main' o está en puerto 3000
  if (hostname.includes('main') || window.location.port === '3000') {
    return 'main';
  }
  
  // Por defecto, Portfolio (menos exigente)
  return 'portfolio';
}

export function getPerformanceManager(): PerformanceManager {
  if (!globalManager) {
    const frontend = detectFrontend();
    globalManager = new PerformanceManager('performance-config', frontend);
  }
  return globalManager;
}
