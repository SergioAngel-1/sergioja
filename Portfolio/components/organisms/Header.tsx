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
  onTerminalOpen?: () => void;
  isHomePage?: boolean;
}

export default function Header({ showBreadcrumbs = false, showHomeBadge = false, onTerminalOpen, isHomePage = false }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile Terminal Button - Top Left */}
      {onTerminalOpen && (
        <motion.button
          onClick={onTerminalOpen}
          className={`lg:hidden ${isHomePage ? 'absolute' : 'fixed'} top-0 left-0 z-50 w-10 h-10 rounded-lg border-2 bg-white/10 border-white text-white hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300 backdrop-blur-sm`}
          style={{ margin: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 400, damping: 25 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open terminal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-white"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>
      )}

      {/* Breadcrumbs or Home Badge - Below terminal button on mobile */}
      {(showBreadcrumbs || showHomeBadge) && (
        <motion.div 
          className="absolute left-0 md:left-20 right-0 z-30"
          style={{ top: onTerminalOpen ? '60px' : '0' }}
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
