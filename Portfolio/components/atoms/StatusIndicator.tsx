'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface StatusIndicatorProps {
  lowPerformanceMode?: boolean;
}

export default function StatusIndicator({ lowPerformanceMode = false }: StatusIndicatorProps) {
  return (
    <motion.div
      className="flex flex-col items-center relative z-10 mb-fluid-xl gap-fluid-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="relative">
        <div 
          className="bg-cyber-red rounded-full" 
          style={{
            width: fluidSizing.space.sm,
            height: fluidSizing.space.sm
          }}
        />
        <motion.div
          className="absolute inset-0 bg-cyber-red rounded-full"
          animate={lowPerformanceMode ? {} : { scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={lowPerformanceMode ? {} : { duration: 2, repeat: Infinity }}
        />
      </div>
      <div 
        className="w-px bg-gradient-to-b from-cyber-red to-transparent" 
        style={{ height: fluidSizing.space.xl }}
      />
    </motion.div>
  );
}
