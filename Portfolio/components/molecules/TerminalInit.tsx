'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface TerminalInitProps {
  profileName?: string;
}

export default function TerminalInit({ profileName }: TerminalInitProps) {
  const { t } = useLanguage();
  const { lowPerformanceMode } = usePerformance();

  const initItems = [
    {
      icon: (
        <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: t('terminal.systemInit'),
      delay: 0.2
    },
    {
      icon: (
        <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
      ),
      label: t('terminal.portfolioLoaded'),
      delay: 0.3
    },
    {
      icon: (
        <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: t('terminal.developer'),
      delay: 0.4
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-cyber-red">❯</span>
        <span className="text-white" style={{ marginLeft: fluidSizing.space.sm }}>{t('terminal.init')}</span>
      </motion.div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center" style={{ paddingLeft: fluidSizing.space.md, gap: fluidSizing.space.xs }}>
        {initItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: lowPerformanceMode ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay, duration: lowPerformanceMode ? 0.25 : 0.3, ease: 'easeOut' }}
            className="group relative flex items-center bg-background-elevated border border-white/20 rounded-full hover:border-cyber-blue-cyan/50 hover:bg-white/5 transition-colors duration-300 w-full sm:w-auto"
            style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, gap: fluidSizing.space.xs, willChange: 'transform, opacity' }}
          >
            <div className="text-white flex-shrink-0">
              {item.icon}
            </div>
            <div className="text-text-secondary font-mono text-fluid-xs flex-1 sm:flex-initial">
              {item.label}
            </div>
            <svg className={`size-icon-sm text-cyber-blue-cyan flex-shrink-0 ${lowPerformanceMode ? '' : 'animate-pulse'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
