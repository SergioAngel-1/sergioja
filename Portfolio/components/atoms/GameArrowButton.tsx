'use client';

import { motion } from 'framer-motion';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface GameArrowButtonProps {
  direction: Direction;
  onClick: () => void;
  disabled?: boolean;
}

const arrowPaths = {
  UP: 'M5 15l7-7 7 7',
  DOWN: 'M19 9l-7 7-7-7',
  LEFT: 'M15 19l-7-7 7-7',
  RIGHT: 'M9 5l7 7-7 7',
};

export default function GameArrowButton({ direction, onClick, disabled = false }: GameArrowButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="w-full p-3 rounded-lg border-2 border-cyber-blue-cyan/50 text-cyber-blue-cyan hover:bg-cyber-blue-cyan/10 active:bg-cyber-blue-cyan/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
      whileTap={!disabled ? { scale: 0.9 } : {}}
      whileHover={!disabled ? { scale: 1.05 } : {}}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={3} 
          d={arrowPaths[direction]} 
        />
      </svg>
    </motion.button>
  );
}
