'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
      className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-0 h-screen overflow-hidden pointer-events-none z-0`}
      style={{ width: '60px' }}
    >
      <motion.div
        className="flex flex-col gap-1 font-mono text-xs opacity-10"
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
