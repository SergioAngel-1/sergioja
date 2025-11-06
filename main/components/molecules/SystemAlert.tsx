'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface SystemAlertProps {
  title?: string;
  subtitle?: string;
  status?: 'active' | 'standby' | 'processing';
  position?: 'top' | 'bottom';
  children?: ReactNode;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function SystemAlert({ 
  title = 'SergioJA',
  subtitle,
  status = 'active',
  position = 'top',
  children,
  onClose,
  isOpen = true
}: SystemAlertProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;
  
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

  return (
    <motion.div
      className={`fixed ${position === 'top' ? 'top-24' : 'bottom-8'} left-1/2 -translate-x-1/2 z-30 cursor-move`}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: -window.innerWidth / 2 + 150,
        right: window.innerWidth / 2 - 150,
        top: -window.innerHeight / 2 + 100,
        bottom: window.innerHeight / 2 - 100
      }}
      initial={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        delay: 0.5 
      }}
    >
      <div className="relative bg-white/90 backdrop-blur-md border border-cyber-black/20 rounded-lg px-4 py-2.5 shadow-lg min-w-[280px]">
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
            onClick={handleClose}
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
        {children && (
          <div className="font-mono text-xs text-cyber-black/70">
            {children}
          </div>
        )}

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
  );
}
