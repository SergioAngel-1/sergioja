'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface Metrics {
  performance: number;
  accessibility: number;
  seo: number;
}

interface ProjectMetricsProps {
  metrics: Metrics;
}

export default function ProjectMetrics({ metrics }: ProjectMetricsProps) {
  const { t } = useLanguage();
  
  const allMetrics = [
    { 
      label: t('projects.performance'), 
      value: metrics.performance,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      label: t('projects.accessibility'), 
      value: metrics.accessibility,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      label: t('projects.seo'), 
      value: metrics.seo,
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
  ];

  const metricsData = allMetrics.filter(m => m.value > 0);

  if (metricsData.length === 0) return null;

  const gridCols = metricsData.length === 1 ? 'grid-cols-1' : metricsData.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={`grid ${gridCols} w-full h-full`}
      style={{ gap: fluidSizing.space.sm }}
    >
      {metricsData.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="relative group"
        >
          <div className="relative h-full bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 overflow-hidden flex flex-col items-center justify-between text-center" style={{ padding: fluidSizing.space.lg }}>
            {/* Background Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Icon */}
            <div className="relative z-10 text-white/60 group-hover:text-white transition-colors flex-shrink-0" style={{ width: fluidSizing.size.iconLg, height: fluidSizing.size.iconLg }}>
              {metric.icon}
            </div>

            {/* Label */}
            <div className="relative z-10 text-text-muted uppercase tracking-wider font-mono flex-shrink-0" style={{ fontSize: fluidSizing.text.xs }}>
              {metric.label}
            </div>

            {/* Progress Bar - Vertical */}
            <div className="relative z-10 flex-1 flex items-end justify-center" style={{ minHeight: '80px', maxHeight: '120px' }}>
              <div className="relative h-full bg-background-elevated rounded-full overflow-hidden" style={{ width: '6px' }}>
                <motion.div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-white to-white/80 rounded-full"
                  initial={{ height: 0 }}
                  animate={{ height: `${metric.value}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Value */}
            <motion.div
              className="font-orbitron font-bold text-white flex-shrink-0"
              style={{ fontSize: fluidSizing.text['2xl'] }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              {metric.value}
            </motion.div>

            {/* Corner Accent */}
            <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white opacity-50 group-hover:opacity-100 transition-opacity" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
