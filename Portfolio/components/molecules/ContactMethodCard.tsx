'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface ContactMethodCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  index: number;
}

export default function ContactMethodCard({ icon, label, value, href, index }: ContactMethodCardProps) {
  const content = (
    <div className="h-full bg-background-elevated border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300" style={{ padding: fluidSizing.space.md }}>
      <div className="flex flex-col items-center text-center" style={{ gap: fluidSizing.space.md }}>
        <div className="text-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <div className="text-text-muted font-mono uppercase tracking-wider text-fluid-xs" style={{ marginBottom: fluidSizing.space.xs }}>
            {label}
          </div>
          <div className="text-text-primary font-rajdhani font-semibold break-all text-fluid-xs">
            {value}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      className={`relative group ${index === 2 ? 'col-span-2 sm:col-span-1' : ''}`}
    >
      {href ? (
        <a href={href} className="block h-full">
          {content}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg blur-lg transition-opacity pointer-events-none" />
        </a>
      ) : (
        <>
          {content}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg blur-lg transition-opacity pointer-events-none" />
        </>
      )}
    </motion.div>
  );
}
