'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import Spinner from '@/components/atoms/Spinner';

interface PageLoaderProps {
  variant?: 'full' | 'simple';
  isLoading?: boolean;
  message?: string;
}

export default function PageLoader({ 
  variant = 'full', 
  isLoading: externalLoading,
  message = 'CARGANDO'
}: PageLoaderProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const pathname = usePathname();
  const shownAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Solo usar el loading interno si no se pasa isLoading como prop
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  // Fix #1: stable callbacks + timer cleanup via ref
  const onStart = useCallback(() => {
    // Clear any pending hide-timer so a rapid start→end→start doesn't flash
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    shownAtRef.current = Date.now();
    setInternalLoading(true);
  }, []);

  const onEnd = useCallback(() => {
    const elapsed = Date.now() - shownAtRef.current;
    const minVisible = 300;
    const delay = Math.max(minVisible - elapsed, 0);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setInternalLoading(false);
    }, delay);
  }, []);

  useEffect(() => {
    if (variant !== 'full' || externalLoading !== undefined) return;
    window.addEventListener('app:navigation-start', onStart);
    window.addEventListener('app:navigation-end', onEnd);
    return () => {
      window.removeEventListener('app:navigation-start', onStart);
      window.removeEventListener('app:navigation-end', onEnd);
      // Fix #1: clean up pending timer on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [variant, externalLoading, onStart, onEnd]);

  useEffect(() => {
    if (variant === 'full' && externalLoading === undefined) {
      window.dispatchEvent(new Event('app:navigation-end'));
    }
  }, [pathname, variant, externalLoading]);

  // Versión simplificada para cargas de datos — Fix #6: uses shared Spinner
  if (variant === 'simple') {
    return (
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center"
            style={{ paddingTop: fluidSizing.space['2xl'], paddingBottom: fluidSizing.space['2xl'], gap: fluidSizing.space.md }}
          >
            <Spinner />

            {/* Loading text — CSS pulse instead of FM */}
            <p className="text-text-muted font-mono text-fluid-sm animate-pulse">
              {message}...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Versión completa para transiciones de página
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background-dark md:left-[var(--nav-width)]"
        >
          {/* Cyber grid background */}
          <div className="absolute inset-0 cyber-grid opacity-20" />

          {/* Fix #4: Fluid glow — smaller on mobile, lighter blur */}
          <div
            className="absolute rounded-full bg-white/15 animate-pulse"
            style={{
              width: 'clamp(12rem, 30vw, 24rem)',
              height: 'clamp(12rem, 30vw, 24rem)',
              filter: 'blur(clamp(60px, 10vw, 150px))',
            }}
          />

          {/* Loader content */}
          <div className="relative z-10 flex flex-col items-center" style={{ gap: fluidSizing.space.lg }}>
            {/* Fix #5 & #6: Shared Spinner with CSS animations, 3 rings for full variant */}
            <Spinner size="clamp(5rem, 8vw, 6rem)" showInnerRing />

            {/* Fix #3: Loading text uses message prop */}
            <div
              className="flex items-center"
              style={{ gap: fluidSizing.space.sm }}
            >
              <span className="font-mono text-white text-fluid-sm">
                {'<'} {message} {'/>'}
              </span>
              {/* Fix #5: CSS animation for dots instead of FM */}
              <span className="flex animate-pulse" style={{ gap: fluidSizing.space.xs }}>
                <span className="bg-white rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.xs }} />
                <span className="bg-white rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.xs }} />
                <span className="bg-cyber-red rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.xs }} />
              </span>
            </div>

            {/* Fix #2: Progress bar now loops continuously */}
            <div className="h-1 bg-background-elevated rounded-full overflow-hidden" style={{ width: 'clamp(12rem, 30vw, 16rem)' }}>
              <div
                className="h-full bg-gradient-to-r from-white via-cyber-red to-white"
                style={{
                  animation: 'progress-slide 1s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute border-t-2 border-l-2 border-white" style={{ top: fluidSizing.space['2xl'], left: fluidSizing.space['2xl'], width: fluidSizing.space['2xl'], height: fluidSizing.space['2xl'] }} />
          <div className="absolute border-t-2 border-r-2 border-white" style={{ top: fluidSizing.space['2xl'], right: fluidSizing.space['2xl'], width: fluidSizing.space['2xl'], height: fluidSizing.space['2xl'] }} />
          <div className="absolute border-b-2 border-l-2 border-white" style={{ bottom: fluidSizing.space['2xl'], left: fluidSizing.space['2xl'], width: fluidSizing.space['2xl'], height: fluidSizing.space['2xl'] }} />
          <div className="absolute border-b-2 border-r-2 border-white" style={{ bottom: fluidSizing.space['2xl'], right: fluidSizing.space['2xl'], width: fluidSizing.space['2xl'], height: fluidSizing.space['2xl'] }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
