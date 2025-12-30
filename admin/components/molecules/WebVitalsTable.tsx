'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/fluidSizing';

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: string;
  url: string;
  timestamp: string;
}

interface MetricInfo {
  unit: string;
}

interface WebVitalsTableProps {
  metrics: WebVitalsMetric[];
  metricInfo: Record<string, MetricInfo>;
}

const RATING_COLORS = {
  good: '#34d399',
  'needs-improvement': '#fbbf24',
  poor: '#ef4444',
};

const formatValue = (value: number, unit: string) => {
  if (unit === 'ms') {
    return `${Math.round(value)}ms`;
  }
  return value.toFixed(3);
};

const getRatingLabel = (rating: string) => {
  if (rating === 'good') return 'Bueno';
  if (rating === 'needs-improvement') return 'Mejora';
  return 'Pobre';
};

export default function WebVitalsTable({ metrics, metricInfo }: WebVitalsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg overflow-hidden"
    >
      <div className="border-b border-admin-primary/20" style={{ padding: fluidSizing.space.lg }}>
        <h3 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text.lg }}>
          Métricas Recientes
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-admin-dark-surface">
            <tr>
              <th className="text-left text-text-muted font-medium" style={{ padding: fluidSizing.space.md, fontSize: fluidSizing.text.sm }}>
                Métrica
              </th>
              <th className="text-left text-text-muted font-medium" style={{ padding: fluidSizing.space.md, fontSize: fluidSizing.text.sm }}>
                Valor
              </th>
              <th className="text-left text-text-muted font-medium" style={{ padding: fluidSizing.space.md, fontSize: fluidSizing.text.sm }}>
                Rating
              </th>
              <th className="text-left text-text-muted font-medium" style={{ padding: fluidSizing.space.md, fontSize: fluidSizing.text.sm }}>
                URL
              </th>
              <th className="text-left text-text-muted font-medium" style={{ padding: fluidSizing.space.md, fontSize: fluidSizing.text.sm }}>
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.slice(0, 20).map((metric) => (
              <tr
                key={metric.id}
                className="border-t border-admin-primary/10 hover:bg-admin-dark-surface/50 transition-colors"
              >
                <td className="text-text-primary font-mono" style={{ padding: fluidSizing.space.md, fontSize: fluidSizing.text.sm }}>
                  {metric.name}
                </td>
                <td className="text-text-primary font-mono font-bold" style={{ padding: fluidSizing.space.md, fontSize: fluidSizing.text.sm }}>
                  {formatValue(metric.value, metricInfo[metric.name]?.unit || '')}
                </td>
                <td style={{ padding: fluidSizing.space.md }}>
                  <span
                    className="inline-block rounded-full font-medium"
                    style={{
                      padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                      fontSize: fluidSizing.text.xs,
                      backgroundColor: `${RATING_COLORS[metric.rating as keyof typeof RATING_COLORS]}20`,
                      color: RATING_COLORS[metric.rating as keyof typeof RATING_COLORS],
                    }}
                  >
                    {getRatingLabel(metric.rating)}
                  </span>
                </td>
                <td className="text-text-secondary truncate max-w-xs" style={{ padding: fluidSizing.space.md, fontSize: fluidSizing.text.xs }}>
                  {metric.url}
                </td>
                <td className="text-text-muted font-mono" style={{ padding: fluidSizing.space.md, fontSize: fluidSizing.text.xs }}>
                  {new Date(metric.timestamp).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
