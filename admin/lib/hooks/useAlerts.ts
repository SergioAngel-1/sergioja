/**
 * useAlerts Hook para Admin
 */

import { useState, useEffect } from 'react';
import { alertManager } from '@/shared/alertSystem';
import type { Alert } from '@/shared/alertSystem';

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
