/**
 * useAlerts Hook
 * Hook de React para usar el sistema de alertas centralizado
 */

import { useState, useEffect } from 'react';
import { alertManager } from '../alertSystem';
import type { Alert } from '../alertSystem';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Suscribirse a cambios en las alertas
    const unsubscribe = alertManager.subscribe((updatedAlerts) => {
      setAlerts(updatedAlerts);
    });

    // Obtener alertas iniciales
    setAlerts(alertManager.getAll());

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  return alerts;
}
