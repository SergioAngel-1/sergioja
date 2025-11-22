'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { useMatrix } from '@/lib/contexts/MatrixContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { logger } from '@/shared/logger';

export default function PerformanceToggle() {
  const { lowPerformanceMode, toggleMode } = usePerformance();
  const { matrixMode, setMatrixMode } = useMatrix();
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Si Matrix está activo, el botón solo desactiva Matrix
  const handleClick = () => {
    if (matrixMode) {
      logger.info('Deactivating Matrix mode from toggle', 'PerformanceToggle');
      setMatrixMode(false);
    } else {
      logger.info('Toggling performance mode from toggle', { currentMode: lowPerformanceMode ? 'low' : 'high' }, 'PerformanceToggle');
      toggleMode();
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-0 bg-background-surface/90 backdrop-blur-sm border border-white/30 rounded-lg hidden md:block z-[70] shadow-lg"
            style={{ right: 'clamp(3.5rem, 5vw, 4rem)', padding: fluidSizing.space.md, minWidth: 'clamp(180px, 20vw, 200px)' }}
          >
            <p className="text-text-muted font-mono text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>
              {matrixMode 
                ? t('matrix.activated')
                : lowPerformanceMode 
                  ? t('performance.lowMode')
                  : t('performance.highMode')}
            </p>
            <p className="text-text-muted text-fluid-xs">
              {matrixMode
                ? t('performance.clickToDeactivate')
                : lowPerformanceMode 
                  ? t('performance.animationsOff')
                  : t('performance.animationsOn')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        className={`relative rounded-full border-2 transition-all duration-300 ${
          matrixMode
            ? 'bg-background-elevated border-cyber-red text-cyber-red animate-pulse'
            : lowPerformanceMode
              ? 'bg-background-elevated border-white/50 text-white/50'
              : 'bg-background-surface border-white text-white hover:bg-white hover:text-black'
        } flex items-center justify-center group shadow-lg`}
        style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Icon - Más pequeño en móvil */}
        <svg
          className="size-icon-md"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {(() => {
            // Ensure the same path during SSR and first client render
            let d = "M13 10V3L4 14h7v7l9-11h-7z"; // default: high (lightning)
            if (mounted) {
              if (matrixMode) d = "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"; // matrix
              else if (lowPerformanceMode) d = "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"; // low
            }
            return (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={d}
              />
            );
          })()}
        </svg>

        {/* Tooltip on mobile */}
        <span className="absolute left-1/2 -translate-x-1/2 font-mono text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-fluid-xs" style={{ bottom: `calc(-1 * ${fluidSizing.space.xl})` }}>
          {matrixMode ? t('performance.matrix') : lowPerformanceMode ? t('performance.low') : t('performance.high')}
        </span>
      </motion.button>
    </div>
  );
}
