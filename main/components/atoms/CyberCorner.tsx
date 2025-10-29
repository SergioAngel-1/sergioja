'use client';

import { motion } from 'framer-motion';

interface CyberCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
  animate?: boolean;
}

export default function CyberCorner({ 
  position, 
  size = 40, 
  color = 'black',
  animate = true 
}: CyberCornerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0';
      case 'top-right':
        return 'top-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
    }
  };

  const getBorderClasses = () => {
    const baseClasses = `border-cyber-${color}`;
    switch (position) {
      case 'top-left':
        return `${baseClasses} border-t-[3px] border-l-[3px]`;
      case 'top-right':
        return `${baseClasses} border-t-[3px] border-r-[3px]`;
      case 'bottom-left':
        return `${baseClasses} border-b-[3px] border-l-[3px]`;
      case 'bottom-right':
        return `${baseClasses} border-b-[3px] border-r-[3px]`;
    }
  };

  const Component = animate ? motion.div : 'div';

  return (
    <Component
      className={`absolute ${getPositionClasses()} ${getBorderClasses()}`}
      style={{ width: size, height: size }}
      {...(animate && {
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: 'easeOut' }
      })}
    />
  );
}
