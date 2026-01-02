'use client';

import { useState, useCallback, useEffect } from 'react';
import ExportSection from '../molecules/ExportSection';
import ExportCard from '../molecules/ExportCard';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { alerts } from '@/lib/alerts';

interface AnalyticsExportsProps {
  onExport: (data: any[], filename: string, format: 'csv' | 'json') => void;
}

export default function AnalyticsExports({ onExport }: AnalyticsExportsProps) {
  const [stats, setStats] = useState({ pageViews: 0, projectViews: 0 });
  const [exportingItems, setExportingItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [pageViewsRes, projectViewsRes] = await Promise.all([
        api.getPageViews({ timeRange: 'all' }),
        api.getProjectViews({ timeRange: 'all' }),
      ]);

      const pageViewsCount = pageViewsRes.success && pageViewsRes.data 
        ? ((pageViewsRes.data as any).stats?.total || (pageViewsRes.data as any).pageViews?.length || 0)
        : 0;

      const projectViewsCount = projectViewsRes.success && projectViewsRes.data
        ? ((projectViewsRes.data as any).stats?.total || (projectViewsRes.data as any).projectViews?.length || 0)
        : 0;

      setStats({ pageViews: pageViewsCount, projectViews: projectViewsCount });
    } catch (error) {
      logger.error('Error loading analytics stats', error);
    }
  };

  const handleExport = useCallback(async (type: 'pageViews' | 'projectViews', format: 'csv' | 'json') => {
    setExportingItems(prev => ({ ...prev, [type]: true }));

    try {
      let data: any[] = [];
      let filename = '';

      switch (type) {
        case 'pageViews': {
          const res = await api.getPageViews({ timeRange: 'all', limit: 10000 });
          data = res.success && res.data ? ((res.data as any).pageViews || res.data) : [];
          filename = `page-views-${new Date().toISOString().split('T')[0]}`;
          break;
        }
        case 'projectViews': {
          const res = await api.getProjectViews({ timeRange: 'all', limit: 10000 });
          data = res.success && res.data ? ((res.data as any).projectViews || res.data) : [];
          filename = `project-views-${new Date().toISOString().split('T')[0]}`;
          break;
        }
      }

      if (!data || data.length === 0) {
        alerts.warning('Sin datos', 'No hay datos disponibles para exportar');
        return;
      }

      onExport(data, filename, format);
      alerts.success('Exportación exitosa', `Se exportaron ${data.length} registros correctamente`);
      logger.info('Export completed', { type, format, count: data.length });
    } catch (error) {
      logger.error('Export error', error);
      alerts.error('Error de exportación', 'No se pudo completar la exportación');
    } finally {
      setExportingItems(prev => ({ ...prev, [type]: false }));
    }
  }, [onExport]);

  return (
    <ExportSection
      title="Analytics"
      description="Exporta datos de navegación y vistas de páginas"
      icon="analytics"
      delay={0.1}
    >
      <ExportCard
        title="Vistas de Página"
        description="Histórico completo de todas las páginas visitadas, incluyendo path, fecha, IP y referrer."
        icon="eye"
        recordCount={stats.pageViews}
        onExport={(format) => handleExport('pageViews', format)}
        isExporting={exportingItems.pageViews}
        delay={0.15}
      />
      <ExportCard
        title="Vistas de Proyectos"
        description="Histórico de vistas individuales de proyectos con información detallada del proyecto visitado."
        icon="projects"
        recordCount={stats.projectViews}
        onExport={(format) => handleExport('projectViews', format)}
        isExporting={exportingItems.projectViews}
        delay={0.2}
      />
    </ExportSection>
  );
}
