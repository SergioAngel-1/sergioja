'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface AvailabilityBadgeProps {
  title: string;
  description: string;
  color: string;
}

export default function AvailabilityBadge({ title, description, color }: AvailabilityBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3, duration: 0.6 }}
      className="bg-background-surface/50 backdrop-blur-sm border border-white/30 rounded-lg"
      style={{ padding: fluidSizing.space.lg }}
    >
      <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.sm }}>
        <div className="relative">
          <div
            className="rounded-full"
            style={{
              width: fluidSizing.space.md,
              height: fluidSizing.space.md,
              backgroundColor: color,
              boxShadow: `0 0 12px ${color}`,
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              width: fluidSizing.space.md,
              height: fluidSizing.space.md,
              backgroundColor: color,
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <span className="font-orbitron font-bold text-white text-fluid-sm">
          {title}
        </span>
      </div>
      <p className="text-text-secondary font-rajdhani leading-relaxed text-fluid-sm">
        {description}
      </p>
    </motion.div>
  );
}
