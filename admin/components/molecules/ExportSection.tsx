'use client';

import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';
import { ReactNode } from 'react';

interface ExportSectionProps {
  title: string;
  description: string;
  icon: string;
  children: ReactNode;
  delay?: number;
}

export default function ExportSection({
  title,
  description,
  icon,
  children,
  delay = 0,
}: ExportSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Section Header */}
      <div className="flex items-center" style={{ gap: fluidSizing.space.md, marginBottom: fluidSizing.space.lg }}>
        <div className="bg-admin-primary/10 rounded-lg flex items-center justify-center border border-admin-primary/20" style={{ width: '56px', height: '56px' }}>
          <Icon name={icon} size={28} className="text-admin-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text['2xl'] }}>
            {title}
          </h2>
          <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, marginTop: fluidSizing.space.xs }}>
            {description}
          </p>
        </div>
      </div>

      {/* Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: fluidSizing.space.lg }}>
        {children}
      </div>
    </motion.div>
  );
}
