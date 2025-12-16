'use client';

import { motion } from 'framer-motion';

interface TimeDisplayProps {
  time: Date | null;
}

export default function TimeDisplay({ time }: TimeDisplayProps) {
  return (
    <motion.div
      className="relative z-10 group cursor-default hidden 2xl:block mb-fluid-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <div 
        className="text-center rounded-lg bg-background-elevated/0 group-hover:bg-background-elevated/50 transition-all duration-300 p-fluid-sm"
      >
        <div 
          className="font-mono text-white group-hover:text-cyber-red transition-colors text-fluid-xs mb-fluid-xs"
        >
          {time ? time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '--:--'}
        </div>
        <div 
          className="font-mono text-text-muted group-hover:text-white transition-colors text-fluid-xs"
        >
          {time ? time.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : '--- --'}
        </div>
      </div>
    </motion.div>
  );
}
