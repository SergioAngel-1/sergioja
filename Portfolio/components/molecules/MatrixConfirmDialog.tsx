'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';

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
            className="relative bg-background-surface border-2 border-cyber-red/50 rounded-lg p-6 max-w-md mx-4 shadow-2xl"
          >
            {/* Warning header */}
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <svg className="w-8 h-8 text-cyber-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </motion.div>
              <div>
                <h3 className="font-orbitron text-xl font-bold text-cyber-red">
                  {t('matrix.warning')}
                </h3>
                <p className="text-xs text-text-muted font-mono">
                  {t('matrix.systemAlert')}
                </p>
              </div>
            </div>

            {/* Warning message */}
            <div className="mb-6 space-y-3">
              <p className="text-text-secondary font-rajdhani text-sm leading-relaxed">
                {t('matrix.message')}
              </p>
              
              <div className="bg-background-dark/50 border border-cyber-red/30 rounded p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-cyber-red">⚠</span>
                  <span className="text-text-muted font-mono">{t('matrix.highCPU')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-cyber-red">⚠</span>
                  <span className="text-text-muted font-mono">{t('matrix.highGPU')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-cyber-red">⚠</span>
                  <span className="text-text-muted font-mono">{t('matrix.batteryDrain')}</span>
                </div>
              </div>

              <p className="text-cyber-blue-cyan text-xs font-mono italic">
                {t('matrix.recommendation')}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 rounded border border-text-muted/30 text-text-muted hover:bg-background-elevated hover:border-text-muted transition-all duration-300 font-mono text-sm"
              >
                {t('matrix.cancel')}
              </button>
              <motion.button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 rounded bg-cyber-red border border-cyber-red text-background-dark hover:bg-cyber-red/80 transition-all duration-300 font-orbitron font-bold text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('matrix.activate')}
              </motion.button>
            </div>

            {/* Glitch effect on border */}
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-cyber-red pointer-events-none"
              animate={{
                opacity: [0, 0.5, 0],
                scale: [1, 1.02, 1],
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
