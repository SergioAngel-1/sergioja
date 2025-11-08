'use client';

import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import LanguageToggle from '@/components/molecules/LanguageToggle';
import PerformanceToggle from '@/components/molecules/PerformanceToggle';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface HeaderProps {
  showBreadcrumbs?: boolean;
  showHomeBadge?: boolean;
}

export default function Header({ showBreadcrumbs = false, showHomeBadge = false }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 md:left-20"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div 
        className="flex items-center justify-between"
        style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}
      >
        {/* Breadcrumbs or Home Badge - Left side */}
        <div className="flex-1">
          {showBreadcrumbs && <Breadcrumbs />}
          {showHomeBadge && (
            <motion.div
              className="inline-block border-2 border-white rounded-sm"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-mono text-fluid-xs text-white font-bold tracking-wider">
                {'<'} {t('home.portfolioLabel')} {'/>'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Action buttons - Right side */}
        <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
          <LanguageToggle />
          <PerformanceToggle />
        </div>
      </div>
    </motion.header>
  );
}
