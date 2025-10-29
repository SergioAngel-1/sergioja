'use client';

import { motion } from 'framer-motion';

interface ScanLineProps {
  direction?: 'horizontal' | 'vertical';
  color?: 'red' | 'blue' | 'purple';
  duration?: number;
}

export default function ScanLine({ 
  direction = 'horizontal', 
  color = 'blue',
  duration = 3 
}: ScanLineProps) {
  const colorClass = color === 'red' 
    ? 'bg-cyber-red' 
    : color === 'blue' 
    ? 'bg-cyber-blue-cyan' 
    : 'bg-cyber-purple';

  const isHorizontal = direction === 'horizontal';

  return (
    <motion.div
      className={`absolute ${isHorizontal ? 'left-0 right-0 h-0.5' : 'top-0 bottom-0 w-0.5'} ${colorClass} opacity-50 pointer-events-none z-20`}
      style={{
        boxShadow: color === 'red'
          ? '0 0 10px rgba(255, 0, 0, 0.8)'
          : color === 'blue'
          ? '0 0 10px rgba(0, 191, 255, 0.8)'
          : '0 0 10px rgba(139, 0, 255, 0.8)'
      }}
      animate={isHorizontal 
        ? { top: ['0%', '100%'] }
        : { left: ['0%', '100%'] }
      }
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}
