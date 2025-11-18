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
  
  const metricsData = [
    { 
      label: t('projects.performance'), 
      value: metrics.performance,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      label: t('projects.accessibility'), 
      value: metrics.accessibility,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      label: t('projects.seo'), 
      value: metrics.seo,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="flex flex-col w-full"
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
          <div className="relative bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 overflow-hidden" style={{ padding: fluidSizing.space.md }}>
            {/* Background Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Icon and Value - Mobile: stacked, Desktop: same row */}
            <div className="relative z-10 mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-between mb-2 sm:mb-0 sm:gap-3">
                  <div className="text-white/60 group-hover:text-white transition-colors w-5 h-5 sm:w-6 sm:h-6">
                    {metric.icon}
                  </div>
                  <div className="sm:hidden w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white group-hover:shadow-glow-white transition-all" />
                </div>
                
                {/* Value */}
                <motion.div
                  className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {metric.value}
                </motion.div>
              </div>
            </div>

            {/* Label */}
            <div className="relative z-10 text-[10px] sm:text-xs text-text-muted uppercase tracking-wider font-mono">
              {metric.label}
            </div>

            {/* Progress Bar */}
            <div className="relative z-10 mt-3 h-0.5 sm:h-1 bg-background-elevated rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-white to-white/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Corner Accent */}
            <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-white opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
