'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import LanguageToggle from '@/components/molecules/LanguageToggle';
import PerformanceToggle from '@/components/molecules/PerformanceToggle';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';

interface HeaderProps {
  showBreadcrumbs?: boolean;
  showHomeBadge?: boolean;
  onTerminalOpen?: () => void;
  isHomePage?: boolean;
}

export default function Header({ showBreadcrumbs = false, showHomeBadge = false, onTerminalOpen, isHomePage = false }: HeaderProps) {
  const { t } = useLanguage();
  const inlineBadgeRef = useRef<HTMLDivElement>(null);
  const [badgeHeight, setBadgeHeight] = useState<number | null>(null);
  const scrollDirection = useScrollDirection({ threshold: 10 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Keep terminal button height exactly equal to inline home badge height on mobile
  useEffect(() => {
    if (!(isHomePage && showHomeBadge)) {
      setBadgeHeight(null);
      return;
    }
    const el = inlineBadgeRef.current;
    if (!el) return;
    const update = () => setBadgeHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [isHomePage, showHomeBadge]);

  // Detectar si el usuario ha hecho scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll(); // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detectar navegación en progreso
  useEffect(() => {
    const handleNavigationStart = () => setIsNavigating(true);
    const handleNavigationEnd = () => setIsNavigating(false);

    window.addEventListener('app:navigation-start', handleNavigationStart);
    window.addEventListener('app:navigation-end', handleNavigationEnd);

    return () => {
      window.removeEventListener('app:navigation-start', handleNavigationStart);
      window.removeEventListener('app:navigation-end', handleNavigationEnd);
    };
  }, []);

  // Detectar cuando se abre/cierra DevTipsModal, TerminalModal o GameModal
  useEffect(() => {
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    window.addEventListener('devtips-modal-open', handleModalOpen);
    window.addEventListener('devtips-modal-close', handleModalClose);
    window.addEventListener('terminal-modal-open', handleModalOpen);
    window.addEventListener('terminal-modal-close', handleModalClose);
    window.addEventListener('game-modal-open', handleModalOpen);
    window.addEventListener('game-modal-close', handleModalClose);

    return () => {
      window.removeEventListener('devtips-modal-open', handleModalOpen);
      window.removeEventListener('devtips-modal-close', handleModalClose);
      window.removeEventListener('terminal-modal-open', handleModalOpen);
      window.removeEventListener('terminal-modal-close', handleModalClose);
      window.removeEventListener('game-modal-open', handleModalOpen);
      window.removeEventListener('game-modal-close', handleModalClose);
    };
  }, []);

  return (
    <>
      {/* Mobile Terminal Button - Top Left */}
      {(onTerminalOpen || (showHomeBadge && isHomePage)) && !isNavigating && !isModalOpen && (
        <div
          className={`lg:hidden ${isHomePage ? 'absolute' : 'fixed'} top-0 left-0 z-[10001] flex items-center`}
          style={{ 
            paddingTop: `max(${fluidSizing.space.md}, calc(${fluidSizing.space.md} + env(safe-area-inset-top, 0px)))`,
            paddingLeft: fluidSizing.space.lg
          }}
        >
          {onTerminalOpen && (
            <motion.button
              onClick={onTerminalOpen}
              className={`relative rounded-sm border-2 border-white text-black bg-white flex items-center justify-center transition-all duration-300 hover:bg-white/90`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open terminal"
              style={{ 
                padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, 
                height: badgeHeight ? `${badgeHeight}px` : undefined, 
                boxSizing: 'border-box' 
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                {/* Chevron ">" */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8l4 4-4 4" />
                {/* Underscore */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h5" />
              </svg>
            </motion.button>
          )}

          {/* Inline Home Badge next to terminal button on mobile home */}
          {showHomeBadge && isHomePage && (
            <motion.div
              ref={inlineBadgeRef}
              className="ml-3 inline-block border-2 border-white rounded-sm"
              style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <span className="font-mono text-fluid-xs text-white font-bold tracking-wider">
                {'<'} {t('home.portfolioLabel')} {'/>'}
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* Breadcrumbs or Home Badge - Below terminal button on mobile */}
      {(showBreadcrumbs || showHomeBadge) && !isNavigating && !isModalOpen && (
        <motion.div 
          className={`absolute left-0 md:left-20 right-0 z-[10001] ${showHomeBadge && !showBreadcrumbs ? 'hidden md:block' : ''}`}
          style={{ 
            paddingTop: onTerminalOpen 
              ? `calc(max(${fluidSizing.space.md}, calc(${fluidSizing.space.md} + env(safe-area-inset-top, 0px))) + 2.5rem)` 
              : `max(${fluidSizing.space.md}, calc(${fluidSizing.space.md} + env(safe-area-inset-top, 0px)))`
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div 
            className="mx-auto w-full"
            style={{ 
              maxWidth: '1600px', 
              paddingLeft: fluidSizing.space.lg,
              paddingRight: fluidSizing.space.lg
            }}
          >
          {showBreadcrumbs && <Breadcrumbs />}
          {showHomeBadge && (
            <motion.div
              className="hidden md:inline-block border-2 border-white rounded-sm"
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
        className="fixed top-0 right-0 z-[10001]"
        style={{ 
          paddingTop: `max(${fluidSizing.space.md}, calc(${fluidSizing.space.md} + env(safe-area-inset-top, 0px)))`,
          paddingRight: `max(${fluidSizing.space.lg}, calc(${fluidSizing.space.lg} + env(safe-area-inset-right, 0px)))`,
          paddingBottom: fluidSizing.space.md,
          paddingLeft: fluidSizing.space.lg
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: isNavigating ? -20 : 0, 
          opacity: isNavigating ? 0 : 1 
        }}
        transition={{ 
          duration: isNavigating ? 0.15 : 0.6,
          ease: 'easeOut' 
        }}
      >
        <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
          <LanguageToggle isScrolled={isScrolled} />
          <PerformanceToggle isScrolled={isScrolled} />
        </div>
      </motion.div>
    </>
  );
}
