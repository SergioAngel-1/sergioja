'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

const FOCUS_KEYS = ['focusTechShort', 'focusStrategicShort', 'focusHumanShort'] as const;

export default function FocusAreas() {
  const { t } = useLanguage();
  const { lowPerformanceMode } = usePerformance();

  return (
    <motion.div
      className="mb-6 lg:mb-0 relative"
      style={{
        marginTop: fluidSizing.space['2xl'],
        paddingTop: fluidSizing.space.xl,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
    >
      {/* Animated gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-white via-text-secondary to-white"
          animate={lowPerformanceMode ? {} : { x: ['-100%', '100%'] }}
          transition={lowPerformanceMode ? {} : { duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ width: '200%' }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-fluid-sm">
        <span className="font-orbitron font-bold text-white text-fluid-base">
          {t('home.focus')}:
        </span>
        {FOCUS_KEYS.map((key, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 + index * 0.1, duration: 0.4 }}
            className="flex items-center gap-fluid-sm"
          >
            {index > 0 && (
              <svg className="size-icon-sm text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <span className="font-rajdhani font-semibold text-text-secondary uppercase tracking-wide text-fluid-xs">
              {t(`home.${key}`)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
