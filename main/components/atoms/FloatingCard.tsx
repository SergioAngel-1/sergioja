'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingCardProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  glowColor?: 'red' | 'blue' | 'purple' | 'black';
}

export default function FloatingCard({ 
  children, 
  delay = 0, 
  duration = 3,
  className = '',
  glowColor = 'black'
}: FloatingCardProps) {
  const glowClass = `shadow-glow-${glowColor}`;
  
  return (
    <motion.div
      className={`bg-background-surface/80 backdrop-blur-sm border-2 border-cyber-${glowColor} rounded-lg p-4 ${glowClass} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      transition={{ 
        delay,
        duration: 0.6,
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: glowColor === 'red' 
          ? '0 0 30px rgba(255, 0, 0, 0.6), 0 0 60px rgba(255, 0, 0, 0.4)'
          : glowColor === 'blue'
          ? '0 0 30px rgba(0, 191, 255, 0.6), 0 0 60px rgba(0, 191, 255, 0.4)'
          : glowColor === 'purple'
          ? '0 0 30px rgba(139, 0, 255, 0.6), 0 0 60px rgba(139, 0, 255, 0.4)'
          : '0 0 30px rgba(0, 0, 0, 0.4), 0 0 60px rgba(0, 0, 0, 0.3)'
      }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
