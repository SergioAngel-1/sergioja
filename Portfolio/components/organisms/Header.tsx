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
    <>
      {/* Breadcrumbs or Home Badge - Static position */}
      {(showBreadcrumbs || showHomeBadge) && (
        <motion.div 
          className="absolute top-0 left-0 md:left-20 right-0 z-30"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div 
            className="mx-auto w-full"
            style={{ 
              maxWidth: '1600px', 
              padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` 
            }}
          >
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
        </motion.div>
      )}

      {/* Action buttons - Fixed top right */}
      <motion.div 
        className="fixed top-0 right-0 z-50"
        style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
          <LanguageToggle />
          <PerformanceToggle />
        </div>
      </motion.div>
    </>
  );
}
