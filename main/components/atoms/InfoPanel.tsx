'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { GridPosition } from '@/lib/gridSystem';


interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  status?: 'active' | 'standby' | 'processing';
  children: ReactNode;
  gridPosition?: GridPosition;
  containerClassName?: string;
  // Deprecated props - mantener por compatibilidad
  position?: 'center' | 'right' | 'right-wide';
  offsetY?: number;
  offsetX?: number;
}

export default function InfoPanel({ 
  isOpen, 
  onClose, 
  title,
  subtitle,
  status = 'active',
  children,
  gridPosition,
  containerClassName,
  position = 'center',
  offsetY = 0,
  offsetX = 0
}: InfoPanelProps) {
  
  const statusConfig = {
    active: {
      color: 'bg-cyber-blue-cyan',
      text: 'ACTIVE',
      pulse: true
    },
    standby: {
      color: 'bg-cyber-purple',
      text: 'STANDBY',
      pulse: false
    },
    processing: {
      color: 'bg-cyber-red',
      text: 'PROCESSING',
      pulse: true
    }
  };

  const currentStatus = statusConfig[status];

  // Si hay gridPosition, usar ese sistema
  if (gridPosition) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed z-30"
            style={{ 
              left: `${gridPosition.x}px`,
              top: `${gridPosition.y}px`,
              width: `${gridPosition.width}px`,
              height: `${gridPosition.height}px`,
            }}
            drag
            dragMomentum={false}
            dragElastic={0.1}
            dragConstraints={{
              left: -gridPosition.x + 20,
              right: window.innerWidth - gridPosition.x - gridPosition.width - 20,
              top: -gridPosition.y + 20,
              bottom: window.innerHeight - gridPosition.y - gridPosition.height - 20
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              delay: 0.1 
            }}
          >
            <div className={`relative w-full h-full bg-white/90 backdrop-blur-md border border-cyber-black/20 rounded-lg p-4 shadow-lg overflow-hidden flex flex-col ${containerClassName || ''}`}>
              {/* Header with status */}
              <div className="flex items-center justify-between gap-4 mb-2 flex-shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Status indicator */}
                  <motion.div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${currentStatus.color}`}
                    animate={currentStatus.pulse ? { 
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.5, 1]
                    } : {}}
                    transition={currentStatus.pulse ? { 
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    } : {}}
                  />
                  
                  {/* Title */}
                  <h2 className="font-orbitron text-base sm:text-lg font-black text-cyber-black tracking-wider truncate">
                    {title}
                  </h2>
                </div>

                {/* Status text */}
                <span className="font-mono text-[9px] sm:text-[10px] text-cyber-black/50 tracking-wide flex-shrink-0 hidden sm:inline">
                  {currentStatus.text}
                </span>

                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  className="w-5 h-5 rounded-md hover:bg-cyber-black/5 flex items-center justify-center transition-all duration-300 group flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-3 h-3 text-cyber-black/40 group-hover:text-cyber-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Subtitle */}
              {subtitle && (
                <p className="font-mono text-xs text-cyber-black/60 mb-2 flex-shrink-0 truncate">
                  {subtitle}
                </p>
              )}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-cyber-black/10 to-transparent mb-2 flex-shrink-0" />

              {/* Content - scrollable */}
              <div className="font-mono text-xs text-cyber-black/70 flex-1 overflow-y-auto custom-scrollbar">
                {children}
              </div>

              {/* Tech details bar */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-cyber-black/5 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* System ID */}
                  <span className="font-mono text-[9px] sm:text-[10px] text-cyber-black/40">
                    ID: SJ-2025
                  </span>
                  
                  {/* Separator */}
                  <div className="w-px h-3 bg-cyber-black/20" />
                  
                  {/* Timestamp */}
                  <motion.span 
                    className="font-mono text-[9px] sm:text-[10px] text-cyber-black/40"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {new Date().toLocaleTimeString('en-US', { 
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </motion.span>
                </div>

                {/* Signal indicator */}
                <div className="flex items-center gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-cyber-black/30"
                      style={{ height: `${(i + 1) * 3}px` }}
                      animate={{ 
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-black/20 rounded-tl-lg" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-black/20 rounded-br-lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Sistema legacy - mantener por compatibilidad
  let positionClasses = '';
  let minWidth = 'min-w-[280px]';
  
  if (position === 'right-wide') {
    positionClasses = 'right-8 top-24';
    minWidth = 'min-w-[500px]';
  } else if (position === 'right') {
    positionClasses = 'right-8 top-24';
  } else {
    positionClasses = 'left-1/2 -translate-x-1/2 top-24';
  }

  const initialX = position.includes('right') ? 300 : 0;
  const initialY = position.includes('right') ? 0 : -100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed ${positionClasses} z-30 cursor-move`}
          style={{ 
            marginTop: `${offsetY}px`,
            marginRight: `${offsetX}px`
          }}
          drag
          dragMomentum={false}
          dragElastic={0.1}
          dragConstraints={{
            left: -window.innerWidth / 2 + 150,
            right: window.innerWidth / 2 - 150,
            top: -window.innerHeight / 2 + 100,
            bottom: window.innerHeight / 2 - 100
          }}
          initial={{ x: initialX, y: initialY, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={{ x: initialX, y: initialY, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 30,
            delay: 0.5 
          }}
        >
          <div className={`relative bg-white/90 backdrop-blur-md border border-cyber-black/20 rounded-lg px-4 py-2.5 shadow-lg ${minWidth} ${containerClassName || ''}`}>
            {/* Header with status */}
            <div className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2 flex-1">
                {/* Status indicator */}
                <motion.div
                  className={`w-2 h-2 rounded-full ${currentStatus.color}`}
                  animate={currentStatus.pulse ? { 
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.5, 1]
                  } : {}}
                  transition={currentStatus.pulse ? { 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  } : {}}
                />
                
                {/* Title */}
                <h2 className="font-orbitron text-lg font-black text-cyber-black tracking-wider">
                  {title}
                </h2>
              </div>

              {/* Status text */}
              <span className="font-mono text-[10px] text-cyber-black/50 tracking-wide">
                {currentStatus.text}
              </span>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="w-5 h-5 rounded-md hover:bg-cyber-black/5 flex items-center justify-center transition-all duration-300 group flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-3 h-3 text-cyber-black/40 group-hover:text-cyber-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="font-mono text-xs text-cyber-black/60 mb-2">
                {subtitle}
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-cyber-black/10 to-transparent mb-2" />

            {/* Content */}
            <div className="font-mono text-xs text-cyber-black/70">
              {children}
            </div>

            {/* Tech details bar */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-cyber-black/5">
              <div className="flex items-center gap-3">
                {/* System ID */}
                <span className="font-mono text-[10px] text-cyber-black/40">
                  ID: SJ-2025
                </span>
                
                {/* Separator */}
                <div className="w-px h-3 bg-cyber-black/20" />
                
                {/* Timestamp */}
                <motion.span 
                  className="font-mono text-[10px] text-cyber-black/40"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {new Date().toLocaleTimeString('en-US', { 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </motion.span>
              </div>

              {/* Signal indicator */}
              <div className="flex items-center gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-cyber-black/30"
                    style={{ height: `${(i + 1) * 3}px` }}
                    animate={{ 
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-black/20 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-black/20 rounded-br-lg" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
