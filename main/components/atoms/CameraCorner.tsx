'use client';

import { motion } from 'framer-motion';

interface CameraCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
}

export default function CameraCorner({ position, size = 80 }: CameraCornerProps) {
  const isTop = position.includes('top');
  const isLeft = position.includes('left');

  return (
    <div 
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Main corner lines - Double line style */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        {/* Outer thick corner */}
        <motion.path
          d={
            position === 'top-left' ? 'M 0 25 L 0 0 L 25 0' :
            position === 'top-right' ? 'M 55 0 L 80 0 L 80 25' :
            position === 'bottom-left' ? 'M 0 55 L 0 80 L 25 80' :
            'M 55 80 L 80 80 L 80 55'
          }
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="square"
          className="text-cyber-black"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {/* Inner thin corner */}
        <motion.path
          d={
            position === 'top-left' ? 'M 8 18 L 8 8 L 18 8' :
            position === 'top-right' ? 'M 62 8 L 72 8 L 72 18' :
            position === 'bottom-left' ? 'M 8 62 L 8 72 L 18 72' :
            'M 62 72 L 72 72 L 72 62'
          }
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
          className="text-cyber-black/50"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
        />

        {/* Diagonal accent line */}
        <motion.line
          x1={isLeft ? 0 : 80}
          y1={isTop ? 0 : 80}
          x2={isLeft ? 12 : 68}
          y2={isTop ? 12 : 68}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
          className="text-cyber-black/30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 1,
            delay: 0.4,
            ease: 'easeInOut'
          }}
        />
      </svg>

      {/* Corner square indicator */}
      <motion.div
        className={`absolute w-2 h-2 border border-cyber-black ${
          position === 'top-left' ? 'top-0 left-0' :
          position === 'top-right' ? 'top-0 right-0' :
          position === 'bottom-left' ? 'bottom-0 left-0' :
          'bottom-0 right-0'
        }`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          delay: 0.6
        }}
      />

      {/* Tech notches */}
      <motion.div
        className={`absolute w-1 h-3 bg-cyber-black ${
          position === 'top-left' ? 'top-6 left-0' :
          position === 'top-right' ? 'top-6 right-0' :
          position === 'bottom-left' ? 'bottom-6 left-0' :
          'bottom-6 right-0'
        }`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      />
      <motion.div
        className={`absolute w-3 h-1 bg-cyber-black ${
          position === 'top-left' ? 'top-0 left-6' :
          position === 'top-right' ? 'top-0 right-6' :
          position === 'bottom-left' ? 'bottom-0 left-6' :
          'bottom-0 right-6'
        }`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      />
    </div>
  );
}
