'use client';

import { motion } from 'framer-motion';
import { usePerformance } from '@/lib/contexts/PerformanceContext';

interface SkeletonLoaderProps {
  variant?: 'text' | 'title' | 'card' | 'image' | 'circle' | 'button';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
  style?: React.CSSProperties;
}

export default function SkeletonLoader({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
  style: customStyle,
}: SkeletonLoaderProps) {
  const { lowPerformanceMode } = usePerformance();

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'title':
        return 'h-8 rounded';
      case 'card':
        return 'h-64 rounded-lg';
      case 'image':
        return 'aspect-video rounded-lg';
      case 'circle':
        return 'rounded-full aspect-square';
      case 'button':
        return 'h-10 rounded';
      default:
        return 'h-4 rounded';
    }
  };

  const baseClasses = `bg-gradient-to-r from-white/5 via-white/10 to-white/5 ${getVariantClasses()}`;
  
  const style = {
    width: width || (variant === 'circle' ? height : '100%'),
    height: height || undefined,
    ...customStyle,
  };

  const skeletonElement = (key: number) => {
    if (lowPerformanceMode) {
      return (
        <div
          key={key}
          className={`${baseClasses} ${className}`}
          style={style}
        />
      );
    }

    return (
      <motion.div
        key={key}
        className={`${baseClasses} ${className}`}
        style={style}
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    );
  };

  if (count === 1) {
    return skeletonElement(0);
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => skeletonElement(index))}
    </>
  );
}
