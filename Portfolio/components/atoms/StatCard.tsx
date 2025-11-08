'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface StatCardProps {
  label: string;
  value: string | number;
  index?: number;
  compact?: boolean;
}

export default function StatCard({ label, value, index = 0, compact = false }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className="relative group"
    >
      <div 
        className="relative bg-background-elevated border border-white/20 rounded-lg overflow-hidden"
        style={{ padding: compact ? fluidSizing.space.xs : fluidSizing.space.md }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center" style={{ gap: compact ? '2px' : fluidSizing.space.xs }}>
          <div className={`font-orbitron font-black text-white ${compact ? 'text-lg' : 'text-fluid-2xl'}`}>
            {value}
          </div>
          <div className={`text-text-muted font-mono uppercase tracking-wider ${compact ? 'text-[8px]' : 'text-fluid-xs'}`}>
            {label}
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white/40" style={{ width: compact ? fluidSizing.space.sm : fluidSizing.space.md, height: compact ? fluidSizing.space.sm : fluidSizing.space.md }} />
        <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white/40" style={{ width: compact ? fluidSizing.space.sm : fluidSizing.space.md, height: compact ? fluidSizing.space.sm : fluidSizing.space.md }} />
      </div>
    </motion.div>
  );
}
