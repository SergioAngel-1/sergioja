'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DataStreamProps {
  position: 'left' | 'right';
  color?: 'red' | 'blue' | 'purple';
}

export default function DataStream({ position, color = 'blue' }: DataStreamProps) {
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

  const colorClass = color === 'red' 
    ? 'text-cyber-red' 
    : color === 'blue' 
    ? 'text-cyber-blue-cyan' 
    : 'text-cyber-purple';

  return (
    <div 
      className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-0 h-screen overflow-hidden pointer-events-none z-0`}
      style={{ width: '60px' }}
    >
      <motion.div
        className="flex flex-col gap-1 font-mono text-xs opacity-20"
        animate={{ y: [0, -20] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
      >
        {lines.map((line, i) => (
          <motion.div
            key={i}
            className={colorClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === 0 ? 1 : 0.5 - (i * 0.03) }}
            transition={{ duration: 0.2 }}
          >
            {line}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
