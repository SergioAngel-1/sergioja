'use client';

import { motion } from 'framer-motion';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const { lowPerformanceMode } = usePerformance();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex-1"
    >
      <h1 
        className="font-orbitron font-black relative inline-block" 
        style={{ fontSize: fluidSizing.text['6xl'], marginBottom: fluidSizing.space.md }}
      >
        <span className="relative inline-block" style={{ color: 'transparent', WebkitTextStroke: '2px white' }}>
          {title}
          <motion.span
            className="absolute inset-0"
            style={{ color: 'transparent', WebkitTextStroke: '2px black' } as any}
            animate={lowPerformanceMode ? {} : {
              x: [0, -5, 5, -3, 3, 0],
              y: [0, 2, -2, 1, -1, 0],
              opacity: [0, 0.8, 0.8, 0.6, 0.6, 0],
            }}
            transition={lowPerformanceMode ? {} : {
              duration: 0.4,
              repeat: Infinity,
              repeatDelay: 4,
            }}
          >
            {title}
          </motion.span>
        </span>
      </h1>
      
      {subtitle && (
        <p 
          className="text-text-secondary font-rajdhani leading-relaxed text-fluid-lg"
          style={{ maxWidth: '600px' }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
