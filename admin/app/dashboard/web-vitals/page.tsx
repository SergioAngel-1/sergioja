'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loader from '@/components/atoms/Loader';
import Button from '@/components/atoms/Button';
import WebVitalsStatsCards from '@/components/molecules/WebVitalsStatsCards';
import WebVitalsMetricCard from '@/components/molecules/WebVitalsMetricCard';
import WebVitalsTable from '@/components/molecules/WebVitalsTable';
import WebVitalsFilters from '@/components/molecules/WebVitalsFilters';
import WebVitalsEmptyState from '@/components/molecules/WebVitalsEmptyState';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { clamp, fluidSizing } from '@/lib/fluidSizing';

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: string;
  delta?: number;
  metricId: string;
  navigationType?: string;
  url: string;
  userAgent?: string;
  timestamp: string;
  createdAt: string;
}

interface WebVitalsStats {
  total: number;
  byMetric: Record<string, number>;
  byRating: Record<string, number>;
  averages: Record<string, number>;
}

interface WebVitalsData {
  metrics: WebVitalsMetric[];
  stats: WebVitalsStats;
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

const METRIC_INFO: Record<string, { name: string; description: string; unit: string; thresholds: { good: number; poor: number } }> = {
  CLS: {
    name: 'Cumulative Layout Shift',
    description: 'Estabilidad visual de la página',
    unit: '',
    thresholds: { good: 0.1, poor: 0.25 },
  },
  LCP: {
    name: 'Largest Contentful Paint',
    description: 'Tiempo de carga del contenido principal',
    unit: 'ms',
    thresholds: { good: 2500, poor: 4000 },
  },
  FID: {
    name: 'First Input Delay',
    description: 'Tiempo de respuesta a la primera interacción',
    unit: 'ms',
    thresholds: { good: 100, poor: 300 },
  },
  INP: {
    name: 'Interaction to Next Paint',
    description: 'Capacidad de respuesta general',
    unit: 'ms',
    thresholds: { good: 200, poor: 500 },
  },
  FCP: {
    name: 'First Contentful Paint',
    description: 'Tiempo hasta el primer contenido visible',
    unit: 'ms',
    thresholds: { good: 1800, poor: 3000 },
  },
  TTFB: {
    name: 'Time to First Byte',
    description: 'Tiempo de respuesta del servidor',
    unit: 'ms',
    thresholds: { good: 800, poor: 1800 },
  },
};


export default function WebVitalsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [data, setData] = useState<WebVitalsData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const loadWebVitals = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const response = await api.getWebVitals({
        timeRange,
        metric: selectedMetric,
      });

      if (response.success && response.data) {
        setData(response.data as WebVitalsData);
      }

      logger.info('Web Vitals loaded successfully');
    } catch (error) {
      logger.error('Error loading Web Vitals', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [timeRange, selectedMetric]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWebVitals();
    }
  }, [isAuthenticated, loadWebVitals]);

  const metricsList = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.stats.byMetric).map(([name, count]) => ({
      name,
      count,
      average: data.stats.averages[name] || 0,
      info: METRIC_INFO[name],
    }));
  }, [data]);

  const ratingDistribution = useMemo(() => {
    if (!data) return { good: 0, 'needs-improvement': 0, poor: 0 };
    return {
      good: data.stats.byRating['good'] || 0,
      'needs-improvement': data.stats.byRating['needs-improvement'] || 0,
      poor: data.stats.byRating['poor'] || 0,
    };
  }, [data]);


  if (isLoading || !isAuthenticated) {
    return <Loader fullScreen text="Cargando Web Vitals..." />;
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xl }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          style={{ gap: fluidSizing.space.md }}
        >
          <div className="flex-1">
            <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: clamp('1.75rem', '5vw', '2.5rem') }}>
              WEB VITALS
            </h1>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, marginTop: fluidSizing.space.xs }}>
              Métricas de rendimiento y experiencia de usuario
            </p>
          </div>

          <div className="grid grid-cols-3 sm:flex w-full sm:w-auto" style={{ gap: fluidSizing.space.xs }}>
            {(['7d', '30d', 'all'] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? 'primary' : 'outline'}
                size="sm"
                className="text-xs sm:text-sm"
              >
                {range === '7d' ? '7d' : range === '30d' ? '30d' : 'Todo'}
              </Button>
            ))}
          </div>
        </motion.div>

        {isLoadingData ? (
          <div className="flex items-center justify-center" style={{ padding: `${fluidSizing.space['2xl']} 0` }}>
            <Loader size="lg" text="Cargando datos..." />
          </div>
        ) : !data || data.stats.total === 0 ? (
          <WebVitalsEmptyState />
        ) : (
          <>
            {/* Distribución por Rating */}
            <WebVitalsStatsCards
              good={ratingDistribution.good}
              needsImprovement={ratingDistribution['needs-improvement']}
              poor={ratingDistribution.poor}
            />

            {/* Filtro por métrica */}
            <WebVitalsFilters
              selectedMetric={selectedMetric || 'all'}
              onMetricChange={(metric) => setSelectedMetric(metric === 'all' ? undefined : metric)}
              metricOptions={[
                { value: 'all', label: 'Todas', count: 0 },
                ...Object.keys(METRIC_INFO).map((metric) => ({
                  value: metric,
                  label: metric,
                  count: 0,
                })),
              ]}
            />

            {/* Métricas por tipo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" style={{ gap: fluidSizing.space.lg }}>
              {metricsList.map((metric, index) => (
                <WebVitalsMetricCard
                  key={metric.name}
                  name={metric.name}
                  count={metric.count}
                  average={metric.average}
                  info={metric.info}
                  index={index}
                />
              ))}
            </div>

            {/* Tabla de métricas recientes */}
            <WebVitalsTable
              metrics={data.metrics}
              metricInfo={METRIC_INFO}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
