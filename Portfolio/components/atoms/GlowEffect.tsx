'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { useMatrix } from '@/lib/contexts/MatrixContext';

interface GlowEffectProps {
  color?: 'cyan' | 'purple' | 'red' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  opacity?: number;
  delay?: number;
  duration?: number;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  animationType?: 'pulse' | 'static';
}

const colorClasses = {
  cyan: 'bg-cyber-blue-cyan',
  purple: 'bg-cyber-purple',
  red: 'bg-cyber-red',
  white: 'bg-white',
};

const sizeClasses = {
  sm: 'w-32 h-32 md:w-64 md:h-64',
  md: 'w-48 h-48 md:w-80 md:h-80',
  lg: 'w-64 h-64 md:w-96 md:h-96',
  xl: 'w-80 h-80 md:w-[400px] md:h-[400px]',
};

const blurClasses = {
  sm: 'blur-[60px] md:blur-[80px]',
  md: 'blur-[80px] md:blur-[120px]',
  lg: 'blur-[100px] md:blur-[150px]',
  xl: 'blur-[120px] md:blur-[200px]',
};

export default function GlowEffect({
  color = 'cyan',
  size = 'lg',
  position = {},
  opacity = 0.3,
  delay = 0,
  duration = 2,
  blur = 'lg',
  animate = true,
  animationType = 'static',
}: GlowEffectProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { lowPerformanceMode } = usePerformance();
  const { matrixMode } = useMatrix();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const baseClasses = `absolute ${colorClasses[color]} ${sizeClasses[size]} ${blurClasses[blur]} rounded-full`;
  
  const positionStyles = {
    top: position.top,
    bottom: position.bottom,
    left: position.left,
    right: position.right,
  };

  // No renderizar hasta que esté montado en el cliente
  if (!isMounted) {
    return null;
  }

  // Si está en modo de bajo rendimiento o no debe animar, renderizar estático
  if (!animate || lowPerformanceMode) {
    return (
      <div
        className={baseClasses}
        style={{ ...positionStyles, opacity }}
        suppressHydrationWarning
      />
    );
  }

  if (animationType === 'pulse') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={matrixMode ? {
          opacity: [opacity * 0.5, opacity * 1.5, opacity * 0.5],
          scale: [0.8, 1.3, 0.8],
          rotate: [0, 180, 360],
        } : {
          opacity,
          scale: 1,
        }}
        transition={matrixMode ? {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        } : {
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
          delay,
        }}
        className={baseClasses}
        style={positionStyles}
        suppressHydrationWarning
      />
    );
  }

  // Static fade-in animation
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration, delay }}
      className={baseClasses}
      style={positionStyles}
      suppressHydrationWarning
    />
  );
}
