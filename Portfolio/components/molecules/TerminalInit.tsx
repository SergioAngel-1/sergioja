'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { usePerformance } from '@/lib/contexts/PerformanceContext';

interface TerminalInitProps {
  profileName?: string;
}

export default function TerminalInit({ profileName }: TerminalInitProps) {
  const { t } = useLanguage();
  const { lowPerformanceMode } = usePerformance();

  const initItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: t('terminal.systemInit'),
      delay: 0.2
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
      ),
      label: t('terminal.portfolioLoaded'),
      delay: 0.3
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: `${t('terminal.developer')}: ${profileName || 'Sergio Jáuregui'}`,
      delay: 0.4
    }
  ];

  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-cyber-red">❯</span>
        <span className="text-white ml-2">{t('terminal.init')}</span>
      </motion.div>

      <div className="pl-6 grid grid-cols-1 md:grid-cols-3 gap-2">
        {initItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay }}
            className="group relative bg-background-elevated border border-white/20 rounded-lg p-3 hover:border-white/40 transition-all duration-300"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center gap-3">
              <div className="flex-shrink-0 text-white">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-text-secondary font-mono truncate">
                  {item.label}
                </div>
              </div>
              <div className="flex-shrink-0">
                <svg className={`w-4 h-4 text-cyber-blue-cyan ${lowPerformanceMode ? '' : 'animate-pulse'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
