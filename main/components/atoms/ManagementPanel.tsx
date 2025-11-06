'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface ManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  position?: 'left' | 'right';
}

export default function ManagementPanel({ 
  isOpen, 
  onClose, 
  title, 
  children,
  position = 'left'
}: ManagementPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed ${position === 'left' ? 'left-8' : 'right-8'} top-20 z-40`}
          initial={{ x: position === 'left' ? -300 : 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: position === 'left' ? -300 : 300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="relative bg-white/95 backdrop-blur-md border border-cyber-black/20 rounded-xl p-4 shadow-2xl min-w-[200px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-cyber-black/40"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
                <span className="font-mono text-xs text-cyber-black/60 tracking-wide">
                  {title}
                </span>
              </div>
              <motion.button
                onClick={onClose}
                className="w-6 h-6 rounded-md hover:bg-cyber-black/5 flex items-center justify-center transition-all duration-300 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-3.5 h-3.5 text-cyber-black/60 group-hover:text-cyber-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-cyber-black/10 to-transparent mb-3" />

            {/* Content */}
            {children}

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyber-black/10 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyber-black/10 rounded-br-lg" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
