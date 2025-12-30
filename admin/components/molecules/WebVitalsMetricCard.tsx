'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/fluidSizing';

interface MetricInfo {
  name: string;
  description: string;
  unit: string;
  thresholds: { good: number; poor: number };
}

interface WebVitalsMetricCardProps {
  name: string;
  count: number;
  average: number;
  info: MetricInfo;
  index: number;
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

export default function WebVitalsMetricCard({
  name,
  count,
  average,
  info,
  index,
}: WebVitalsMetricCardProps) {
  const getRatingColor = () => {
    if (average <= info.thresholds.good) return RATING_COLORS.good;
    if (average <= info.thresholds.poor) return RATING_COLORS['needs-improvement'];
    return RATING_COLORS.poor;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
      className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg hover:border-admin-primary/40 transition-all duration-300"
      style={{ padding: fluidSizing.space.lg }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: fluidSizing.space.md }}>
        <div>
          <h3 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text.lg }}>
            {name}
          </h3>
          <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
            {info.name}
          </p>
        </div>
        <div className="bg-admin-primary/20 rounded-full flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
          <span className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text.lg }}>
            {count}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: fluidSizing.space.sm }}>
        <div className="flex items-center justify-between" style={{ marginBottom: fluidSizing.space.xs }}>
          <span className="text-text-secondary" style={{ fontSize: fluidSizing.text.sm }}>
            Promedio
          </span>
          <span className="font-mono font-bold text-text-primary" style={{ fontSize: fluidSizing.text.base }}>
            {formatValue(average, info.unit)}
          </span>
        </div>
        <div className="h-2 bg-admin-dark-surface rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${Math.min((average / info.thresholds.poor) * 100, 100)}%`,
              backgroundColor: getRatingColor(),
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: fluidSizing.space.xs, marginTop: fluidSizing.space.md }}>
        <div className="text-center" style={{ padding: fluidSizing.space.xs }}>
          <div className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>Bueno</div>
          <div className="font-mono font-bold" style={{ fontSize: fluidSizing.text.sm, color: RATING_COLORS.good }}>
            ≤ {formatValue(info.thresholds.good, info.unit)}
          </div>
        </div>
        <div className="text-center" style={{ padding: fluidSizing.space.xs }}>
          <div className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>Pobre</div>
          <div className="font-mono font-bold" style={{ fontSize: fluidSizing.text.sm, color: RATING_COLORS.poor }}>
            &gt; {formatValue(info.thresholds.poor, info.unit)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
