'use client';

import { useState, useCallback, useEffect } from 'react';
import ExportSection from '../molecules/ExportSection';
import ExportCard from '../molecules/ExportCard';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { alerts } from '@/lib/alerts';

interface WebVitalsExportsProps {
  onExport: (data: any[], filename: string, format: 'csv' | 'json') => void;
}

export default function WebVitalsExports({ onExport }: WebVitalsExportsProps) {
  const [stats, setStats] = useState({ webVitals: 0 });
  const [exportingItems, setExportingItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.getWebVitals({ timeRange: 'all' });
      const webVitalsCount = res.success && res.data
        ? ((res.data as any).stats?.total || (res.data as any).metrics?.length || 0)
        : 0;

      setStats({ webVitals: webVitalsCount });
    } catch (error) {
      logger.error('Error loading web vitals stats', error);
    }
  };

  const handleExport = useCallback(async (format: 'csv' | 'json') => {
    setExportingItems(prev => ({ ...prev, webVitals: true }));

    try {
      const res = await api.getWebVitals({ timeRange: 'all', limit: 10000 });
      const data = res.success && res.data ? ((res.data as any).metrics || res.data) : [];
      const filename = `web-vitals-${new Date().toISOString().split('T')[0]}`;

      if (!data || data.length === 0) {
        alerts.warning('Sin datos', 'No hay datos disponibles para exportar');
        return;
      }

      onExport(data, filename, format);
      alerts.success('Exportación exitosa', `Se exportaron ${data.length} registros correctamente`);
      logger.info('Export completed', { type: 'webVitals', format, count: data.length });
    } catch (error) {
      logger.error('Export error', error);
      alerts.error('Error de exportación', 'No se pudo completar la exportación');
    } finally {
      setExportingItems(prev => ({ ...prev, webVitals: false }));
    }
  }, [onExport]);

  return (
    <ExportSection
      title="Web Vitals"
      description="Exporta métricas de rendimiento y experiencia de usuario"
      icon="activity"
      delay={0.25}
    >
      <ExportCard
        title="Core Web Vitals"
        description="Métricas completas de rendimiento: CLS, LCP, FID, INP, FCP, TTFB con ratings y timestamps."
        icon="zap"
        recordCount={stats.webVitals}
        onExport={handleExport}
        isExporting={exportingItems.webVitals}
        delay={0.3}
      />
    </ExportSection>
  );
}
