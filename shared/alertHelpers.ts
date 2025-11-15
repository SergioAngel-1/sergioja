/**
 * Alert Helpers
 * Funciones auxiliares para trabajar con el sistema de alertas
 * Pure TypeScript - Sin dependencias
 */

import type { Alert, AlertType, AlertPosition } from './alertSystem';
import { alertStyles } from './alertSystem';

/**
 * Genera clases CSS para una alerta según su tipo
 */
export function getAlertClasses(type: AlertType): {
  container: string;
  icon: string;
  title: string;
  message: string;
} {
  const baseClasses = {
    container: 'rounded-lg border backdrop-blur-sm shadow-md sm:shadow-lg transition-all duration-300',
    icon: 'text-xl sm:text-2xl',
    title: 'font-orbitron font-bold text-xs sm:text-sm',
    message: 'font-mono text-[11px] sm:text-xs opacity-80',
  };

  const typeClasses = {
    success: 'border-green-500/30 bg-green-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
    processing: 'border-purple-500/30 bg-purple-500/10',
  };

  return {
    container: `${baseClasses.container} ${typeClasses[type]}`,
    icon: baseClasses.icon,
    title: baseClasses.title,
    message: baseClasses.message,
  };
}

/**
 * Obtiene el icono para un tipo de alerta
 */
export function getAlertIcon(type: AlertType): string {
  return alertStyles[type].icon;
}

/**
 * Obtiene el color para un tipo de alerta
 */
export function getAlertColor(type: AlertType): string {
  return alertStyles[type].color;
}

/**
 * Agrupa alertas por posición
 */
export function groupAlertsByPosition(alerts: Alert[]): Map<AlertPosition, Alert[]> {
  const grouped = new Map<AlertPosition, Alert[]>();
  
  alerts.forEach(alert => {
    const position = alert.position || 'bottom-left';
    if (!grouped.has(position)) {
      grouped.set(position, []);
    }
    grouped.get(position)!.push(alert);
  });
  
  return grouped;
}

/**
 * Ordena alertas por timestamp (más recientes primero)
 */
export function sortAlertsByTime(alerts: Alert[]): Alert[] {
  return [...alerts].sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Filtra alertas por tipo
 */
export function filterAlertsByType(alerts: Alert[], type: AlertType): Alert[] {
  return alerts.filter(alert => alert.type === type);
}

/**
 * Calcula el progreso de una alerta con duración
 */
export function getAlertProgress(alert: Alert): number {
  if (!alert.duration || alert.duration === 0) return 0;
  
  const elapsed = Date.now() - alert.timestamp;
  const progress = (elapsed / alert.duration) * 100;
  
  return Math.min(progress, 100);
}

/**
 * Verifica si una alerta ha expirado
 */
export function isAlertExpired(alert: Alert): boolean {
  if (!alert.duration || alert.duration === 0) return false;
  return Date.now() - alert.timestamp >= alert.duration;
}

/**
 * Formatea el tiempo transcurrido desde que se creó la alerta
 */
export function formatElapsedTime(timestamp: number): string {
  const elapsed = Date.now() - timestamp;
  
  if (elapsed < 1000) return 'ahora';
  if (elapsed < 60000) return `hace ${Math.floor(elapsed / 1000)}s`;
  if (elapsed < 3600000) return `hace ${Math.floor(elapsed / 60000)}m`;
  if (elapsed < 86400000) return `hace ${Math.floor(elapsed / 3600000)}h`;
  
  return new Date(timestamp).toLocaleDateString('es-ES');
}

/**
 * Genera un mensaje de accesibilidad para una alerta
 */
export function getAlertAriaLabel(alert: Alert): string {
  const typeText = {
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información',
    processing: 'Procesando',
  };
  
  return `${typeText[alert.type]}: ${alert.title}${alert.message ? `. ${alert.message}` : ''}`;
}

/**
 * Genera estilos inline para una alerta
 */
export function getAlertInlineStyles(alert: Alert): Record<string, string> {
  const style = alertStyles[alert.type];
  
  return {
    borderColor: style.borderColor,
    backgroundColor: style.bgColor,
    color: style.color,
  };
}

/**
 * Calcula la posición en píxeles para una alerta
 */
export function calculateAlertPosition(
  position: AlertPosition,
  index: number,
  alertHeight = 80,
  gap = 12
): { top?: string; bottom?: string; left?: string; right?: string; transform?: string } {
  const offset = index * (alertHeight + gap);
  
  const positions = {
    'top-left': { top: `${offset + 16}px`, left: '16px' },
    'top-center': { top: `${offset + 16}px`, left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: `${offset + 16}px`, right: '16px' },
    'bottom-left': { bottom: `${offset + 16}px`, left: '16px' },
    'bottom-center': { bottom: `${offset + 16}px`, left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: `${offset + 16}px`, right: '16px' },
  };
  
  return positions[position];
}

/**
 * Valida si una alerta es válida
 */
export function isValidAlert(alert: Partial<Alert>): alert is Alert {
  return !!(
    alert.id &&
    alert.type &&
    alert.title &&
    alert.timestamp &&
    typeof alert.dismissible === 'boolean'
  );
}

/**
 * Crea un resumen de alertas activas
 */
export function getAlertsSummary(alerts: Alert[]): {
  total: number;
  byType: Record<AlertType, number>;
  dismissible: number;
  permanent: number;
} {
  const summary = {
    total: alerts.length,
    byType: {
      success: 0,
      error: 0,
      warning: 0,
      info: 0,
      processing: 0,
    } as Record<AlertType, number>,
    dismissible: 0,
    permanent: 0,
  };
  
  alerts.forEach(alert => {
    summary.byType[alert.type]++;
    if (alert.dismissible) {
      summary.dismissible++;
    } else {
      summary.permanent++;
    }
  });
  
  return summary;
}
