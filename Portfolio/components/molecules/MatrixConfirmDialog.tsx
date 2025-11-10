'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface MatrixConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function MatrixConfirmDialog({ isOpen, onConfirm, onCancel }: MatrixConfirmDialogProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-background-dark/90 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background-dark border-2 border-white/30 rounded-lg max-w-md mx-4 shadow-2xl overflow-hidden"
          >
            {/* Corner accents - Red for alert */}
            <div className="absolute top-0 left-0 border-t-2 border-l-2 border-cyber-red z-10" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
            <div className="absolute top-0 right-0 border-t-2 border-r-2 border-cyber-red z-10" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
            <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-cyber-red z-10" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
            <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-cyber-red z-10" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />

            <div style={{ padding: fluidSizing.space.lg }}>
              {/* Warning header */}
              <div className="flex items-center bg-cyber-red/10 border-b border-cyber-red/30" style={{ gap: fluidSizing.space.md, padding: fluidSizing.space.md, marginLeft: `-${fluidSizing.space.lg}`, marginRight: `-${fluidSizing.space.lg}`, marginTop: `-${fluidSizing.space.lg}`, marginBottom: fluidSizing.space.md }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <svg className="size-icon-lg text-cyber-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="font-orbitron font-bold text-cyber-red text-fluid-xl">
                    {t('matrix.warning')}
                  </h3>
                  <p className="text-text-muted font-mono text-fluid-xs">
                    {t('matrix.systemAlert')}
                  </p>
                </div>
              </div>

              {/* Warning message */}
              <div style={{ marginBottom: fluidSizing.space.lg, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
                <p className="text-text-secondary font-rajdhani leading-relaxed text-fluid-sm">
                  {t('matrix.message')}
                </p>
                
                <div className="bg-background-elevated border border-cyber-red/30 rounded" style={{ padding: fluidSizing.space.md, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}>
                  <div className="flex items-center text-fluid-xs" style={{ gap: fluidSizing.space.sm }}>
                    <span className="text-cyber-red font-mono">{'>'}</span>
                    <span className="text-text-muted font-mono">{t('matrix.highCPU')}</span>
                  </div>
                  <div className="flex items-center text-fluid-xs" style={{ gap: fluidSizing.space.sm }}>
                    <span className="text-cyber-red font-mono">{'>'}</span>
                    <span className="text-text-muted font-mono">{t('matrix.highGPU')}</span>
                  </div>
                  <div className="flex items-center text-fluid-xs" style={{ gap: fluidSizing.space.sm }}>
                    <span className="text-cyber-red font-mono">{'>'}</span>
                    <span className="text-text-muted font-mono">{t('matrix.batteryDrain')}</span>
                  </div>
                </div>

                <p className="text-white/60 font-mono italic text-fluid-xs">
                  {t('matrix.recommendation')}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex" style={{ gap: fluidSizing.space.md }}>
                <button
                  onClick={onCancel}
                  className="flex-1 rounded border-2 border-white/30 text-white hover:bg-white/10 hover:border-white transition-all duration-300 font-mono text-fluid-sm"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
                >
                  {t('matrix.cancel')}
                </button>
                <motion.button
                  onClick={onConfirm}
                  className="flex-1 rounded border-2 border-cyber-red bg-cyber-red text-white hover:bg-cyber-red/80 hover:shadow-lg hover:shadow-cyber-red/50 transition-all duration-300 font-orbitron font-bold text-fluid-sm"
                  style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('matrix.activate')}
                </motion.button>
              </div>
            </div>

            {/* Glitch effect on border */}
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-cyber-red pointer-events-none"
              animate={{
                opacity: [0, 0.8, 0],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
