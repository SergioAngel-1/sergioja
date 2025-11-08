'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fluidSizing } from '@/lib/fluidSizing';

interface DataStreamProps {
  position: 'left' | 'right';
}

export default function DataStream({ position }: DataStreamProps) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const generateLine = () => {
      return Array.from({ length: 20 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    };

    const interval = setInterval(() => {
      setLines(prev => {
        const newLines = [generateLine(), ...prev.slice(0, 15)];
        return newLines;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed top-0 h-screen overflow-hidden pointer-events-none z-0"
      style={{ 
        width: 'clamp(40px, 5vw, 60px)',
        [position]: fluidSizing.space.md
      }}
    >
      <motion.div
        className="flex flex-col font-mono opacity-30 text-fluid-xs"
        style={{ gap: fluidSizing.space.xs }}
        animate={{ y: [0, -20] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
      >
        {lines.map((line, i) => (
          <motion.div
            key={i}
            className="text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === 0 ? 0.5 : 0.3 - (i * 0.02) }}
            transition={{ duration: 0.2 }}
          >
            {line}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
