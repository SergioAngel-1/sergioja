'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import { api } from '@/lib/api-client';
import { alerts } from '@/lib/alerts';
import { logger } from '@/lib/logger';
import { fluidSizing } from '@/lib/fluidSizing';

interface WebVitalsMaintenanceButtonsProps {
  onMaintenanceComplete?: () => void;
}

export default function WebVitalsMaintenanceButtons({
  onMaintenanceComplete,
}: WebVitalsMaintenanceButtonsProps) {
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const handleCleanup = async () => {
    const confirmed = await new Promise<boolean>((resolve) => {
      alerts.confirm(
        '¿Limpiar métricas antiguas?',
        'Se eliminarán todas las métricas de Web Vitals con más de 90 días de antigüedad. Esta acción no se puede deshacer.',
        () => resolve(true),
        () => resolve(false),
        'Eliminar',
        'Cancelar'
      );
    });

    if (!confirmed) return;

    try {
      setIsCleaningUp(true);
      const response = await api.cleanupWebVitals(90);

      if (response.success && response.data) {
        const { deleted, remaining, oldestMetric } = response.data as any;
        
        alerts.success(
          'Limpieza completada',
          `Se eliminaron ${deleted} métricas. Quedan ${remaining} métricas en la base de datos.${
            oldestMetric ? ` La métrica más antigua es del ${new Date(oldestMetric).toLocaleDateString('es-ES')}.` : ''
          }`
        );

        logger.info('Web Vitals cleanup completed', { deleted, remaining });
        
        if (onMaintenanceComplete) {
          onMaintenanceComplete();
        }
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      logger.error('Error cleaning up Web Vitals', error);
      alerts.error(
        'Error al limpiar métricas',
        'No se pudieron eliminar las métricas antiguas. Por favor, intenta nuevamente.'
      );
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = await new Promise<boolean>((resolve) => {
      alerts.confirm(
        '⚠️ ¿ELIMINAR TODAS LAS MÉTRICAS?',
        'Esta acción eliminará TODAS las métricas de Web Vitals de la base de datos. Esta acción NO se puede deshacer. ¿Estás completamente seguro?',
        () => resolve(true),
        () => resolve(false),
        'Sí, eliminar todo',
        'Cancelar'
      );
    });

    if (!confirmed) return;

    try {
      setIsDeletingAll(true);
      const response = await api.deleteAllWebVitals();

      if (response.success && response.data) {
        const { deleted } = response.data as any;
        
        alerts.success(
          'Todas las métricas eliminadas',
          `Se eliminaron ${deleted} métricas de Web Vitals. La base de datos está ahora vacía.`
        );

        logger.warn('All Web Vitals deleted', { deleted });
        
        if (onMaintenanceComplete) {
          onMaintenanceComplete();
        }
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      logger.error('Error deleting all Web Vitals', error);
      alerts.error(
        'Error al eliminar métricas',
        'No se pudieron eliminar todas las métricas. Por favor, intenta nuevamente.'
      );
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
      style={{ padding: fluidSizing.space.lg }}
    >
      <div style={{ marginBottom: fluidSizing.space.md }}>
        <h3 className="font-orbitron font-bold text-admin-primary flex items-center" style={{ fontSize: fluidSizing.text.lg, gap: fluidSizing.space.sm }}>
          <Icon name="cpu" size={20} />
          Mantenimiento
        </h3>
        <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, marginTop: fluidSizing.space.xs }}>
          Optimiza el almacenamiento de métricas
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: fluidSizing.space.md }}>
        {/* Botón de Limpieza */}
        <div className="bg-admin-dark-surface rounded-lg" style={{ padding: fluidSizing.space.md }}>
          <div className="flex items-start" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.sm }}>
            <div className="bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px' }}>
              <Icon name="trash" size={20} className="text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-text-primary" style={{ fontSize: fluidSizing.text.base }}>
                Limpiar Antiguas
              </h4>
              <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
                Elimina métricas &gt;90 días
              </p>
            </div>
          </div>
          <Button
            onClick={handleCleanup}
            variant="outline"
            size="sm"
            disabled={isCleaningUp}
            isLoading={isCleaningUp}
            icon={isCleaningUp ? undefined : "trash"}
            className="w-full"
          >
            {isCleaningUp ? 'Limpiando...' : 'Ejecutar Limpieza'}
          </Button>
        </div>

        {/* Botón de Eliminar Todo */}
        <div className="bg-admin-dark-surface rounded-lg" style={{ padding: fluidSizing.space.md }}>
          <div className="flex items-start" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.sm }}>
            <div className="bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px' }}>
              <Icon name="delete" size={20} className="text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-text-primary" style={{ fontSize: fluidSizing.text.base }}>
                Limpiar Todo
              </h4>
              <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
                Elimina todas las métricas
              </p>
            </div>
          </div>
          <Button
            onClick={handleDeleteAll}
            variant="danger"
            size="sm"
            disabled={isDeletingAll}
            isLoading={isDeletingAll}
            icon="delete"
            className="w-full"
          >
            {isDeletingAll ? 'Eliminando...' : 'Eliminar Todo'}
          </Button>
        </div>
      </div>

      <div className="bg-admin-dark/50 rounded-lg" style={{ padding: fluidSizing.space.sm, marginTop: fluidSizing.space.md }}>
        <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
          <div className="flex-shrink-0">
            <Icon name="info" size={16} className="text-admin-primary" />
          </div>
          <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>
            <strong className="text-text-secondary">Recomendación:</strong> Ejecuta la limpieza mensualmente y la agregación semanalmente para mantener la base de datos optimizada.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
