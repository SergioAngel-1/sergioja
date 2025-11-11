/**
 * Sistema de Alertas Compartido
 * Pure TypeScript - Sin dependencias de React o Node
 * Puede ser usado en Portfolio y Main
 */

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'processing';
export type AlertPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number; // milliseconds, 0 = no auto-close
  position?: AlertPosition;
  timestamp: number;
  dismissible?: boolean;
}

export interface AlertConfig {
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
  position?: AlertPosition;
  dismissible?: boolean;
}

/**
 * Configuración de estilos por tipo de alerta
 */
export const alertStyles = {
  success: {
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    icon: '✓',
  },
  error: {
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    icon: '✗',
  },
  warning: {
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    icon: '⚠',
  },
  info: {
    color: '#00BFFF',
    bgColor: 'rgba(0, 191, 255, 0.1)',
    borderColor: 'rgba(0, 191, 255, 0.3)',
    icon: 'ℹ',
  },
  processing: {
    color: '#8B00FF',
    bgColor: 'rgba(139, 0, 255, 0.1)',
    borderColor: 'rgba(139, 0, 255, 0.3)',
    icon: '⟳',
  },
} as const;

/**
 * Posiciones disponibles para las alertas
 */
export const alertPositions = {
  'top-left': { top: '1rem', left: '1rem' },
  'top-center': { top: '1rem', left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: '1rem', right: '1rem' },
  'bottom-left': { bottom: '1rem', left: '1rem' },
  'bottom-center': { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: '1rem', right: '1rem' },
} as const;

/**
 * Clase para gestionar el sistema de alertas
 */
export class AlertManager {
  private alerts: Map<string, Alert> = new Map();
  private listeners: Set<(alerts: Alert[]) => void> = new Set();
  private idCounter = 0;

  /**
   * Genera un ID único para la alerta
   */
  private generateId(): string {
    return `alert-${Date.now()}-${this.idCounter++}`;
  }

  /**
   * Añade una nueva alerta
   */
  add(config: AlertConfig): string {
    const alert: Alert = {
      id: this.generateId(),
      type: config.type,
      title: config.title,
      message: config.message,
      duration: config.duration ?? 5000,
      position: config.position ?? 'bottom-left',
      timestamp: Date.now(),
      dismissible: config.dismissible ?? true,
    };

    this.alerts.set(alert.id, alert);
    this.notifyListeners();

    // Auto-dismiss si tiene duración
    if (alert.duration && alert.duration > 0) {
      setTimeout(() => {
        this.remove(alert.id);
      }, alert.duration);
    }

    return alert.id;
  }

  /**
   * Elimina una alerta por ID
   */
  remove(id: string): void {
    if (this.alerts.delete(id)) {
      this.notifyListeners();
    }
  }

  /**
   * Elimina todas las alertas
   */
  clear(): void {
    this.alerts.clear();
    this.notifyListeners();
  }

  /**
   * Obtiene todas las alertas activas
   */
  getAll(): Alert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Obtiene alertas por posición
   */
  getByPosition(position: AlertPosition): Alert[] {
    return this.getAll().filter(alert => alert.position === position);
  }

  /**
   * Suscribe un listener para cambios en las alertas
   */
  subscribe(listener: (alerts: Alert[]) => void): () => void {
    this.listeners.add(listener);
    // Retorna función para desuscribirse
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notifica a todos los listeners
   */
  private notifyListeners(): void {
    const alerts = this.getAll();
    this.listeners.forEach(listener => listener(alerts));
  }

  /**
   * Métodos de conveniencia para tipos específicos
   */
  success(title: string, message?: string, duration?: number): string {
    return this.add({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration?: number): string {
    return this.add({ type: 'error', title, message, duration });
  }

  warning(title: string, message?: string, duration?: number): string {
    return this.add({ type: 'warning', title, message, duration });
  }

  info(title: string, message?: string, duration?: number): string {
    return this.add({ type: 'info', title, message, duration });
  }

  processing(title: string, message?: string, duration = 0): string {
    return this.add({ type: 'processing', title, message, duration });
  }
}

/**
 * Instancia global del gestor de alertas
 */
export const alertManager = new AlertManager();

/**
 * Funciones helper para uso rápido
 */
export const alerts = {
  success: (title: string, message?: string, duration?: number) => 
    alertManager.success(title, message, duration),
  
  error: (title: string, message?: string, duration?: number) => 
    alertManager.error(title, message, duration),
  
  warning: (title: string, message?: string, duration?: number) => 
    alertManager.warning(title, message, duration),
  
  info: (title: string, message?: string, duration?: number) => 
    alertManager.info(title, message, duration),
  
  processing: (title: string, message?: string) => 
    alertManager.processing(title, message),
  
  dismiss: (id: string) => 
    alertManager.remove(id),
  
  clear: () => 
    alertManager.clear(),
};

/**
 * Utilidades para formatear tiempo
 */
export function formatAlertTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 1000) return 'Ahora';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  return new Date(timestamp).toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * Validación de configuración de alerta
 */
export function validateAlertConfig(config: Partial<AlertConfig>): config is AlertConfig {
  return !!(config.type && config.title);
}