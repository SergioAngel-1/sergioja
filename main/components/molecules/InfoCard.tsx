'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  color?: 'red' | 'blue' | 'purple' | 'black';
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay?: number;
}

export default function InfoCard({ 
  icon, 
  title, 
  value, 
  color = 'black',
  position,
  delay = 0 
}: InfoCardProps) {
  const colorClass = color === 'red' 
    ? 'border-cyber-red text-cyber-red' 
    : color === 'blue' 
    ? 'border-cyber-blue-cyan text-cyber-blue-cyan' 
    : color === 'purple'
    ? 'border-cyber-purple text-cyber-purple'
    : 'border-cyber-black text-cyber-black';

  const glowClass = `shadow-glow-${color}`;

  return (
    <motion.div
      className="fixed z-20"
      style={position}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
    >
      <motion.div
        className={`bg-background-surface/90 backdrop-blur-md border-2 ${colorClass} ${glowClass} rounded-lg p-4 min-w-[150px]`}
        whileHover={{ scale: 1.05 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ 
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className={colorClass}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            {icon}
          </motion.div>
          <div className="flex-1">
            <div className="text-[10px] text-text-muted uppercase tracking-wider">
              {title}
            </div>
            <div className={`text-lg font-orbitron font-bold ${colorClass}`}>
              {value}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
