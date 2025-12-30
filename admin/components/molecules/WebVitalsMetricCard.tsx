'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';
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
  const [showTooltip, setShowTooltip] = useState(false);

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
        <div className="flex-1">
          <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
            <h3 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text.lg }}>
              {name}
            </h3>
            <div 
              className="relative flex-shrink-0"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="cursor-help text-text-muted hover:text-admin-primary transition-colors">
                <Icon name="info" size={16} />
              </div>
              {showTooltip && (
                <div 
                  className="absolute left-0 top-full bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-2xl z-50"
                  style={{ 
                    padding: fluidSizing.space.sm,
                    marginTop: fluidSizing.space.xs,
                    minWidth: '250px',
                    maxWidth: '300px'
                  }}
                >
                  <p className="text-text-primary font-medium" style={{ fontSize: fluidSizing.text.sm, marginBottom: fluidSizing.space.xs }}>
                    {info.name}
                  </p>
                  <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>
                    {info.description}
                  </p>
                </div>
              )}
            </div>
          </div>
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
