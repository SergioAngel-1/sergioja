'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
}

const STATUS_CONFIG: Record<AvailabilityStatus, { i18nKey: string; fallback: string; color: string }> = {
  available: { i18nKey: 'home.available', fallback: 'Disponible', color: '#00F7C0' },
  busy: { i18nKey: 'home.busy', fallback: 'Ocupado', color: '#FFA500' },
  unavailable: { i18nKey: 'home.unavailable', fallback: 'No disponible', color: '#FE4C4C' },
};

export default function AvailabilityBadge({ status }: AvailabilityBadgeProps) {
  const { t } = useLanguage();

  const config = useMemo(() => {
    const c = STATUS_CONFIG[status];
    return { text: t(c.i18nKey) || c.fallback, color: c.color };
  }, [status, t]);

  return (
    <motion.div
      className="flex items-center gap-fluid-sm justify-center sm:justify-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <div className="relative">
        <div
          className="rounded-full animate-pulse"
          style={{
            width: fluidSizing.space.md,
            height: fluidSizing.space.md,
            backgroundColor: config.color,
            boxShadow: `0 0 12px ${config.color}`,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: fluidSizing.space.md,
            height: fluidSizing.space.md,
            backgroundColor: config.color,
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <span className="text-text-secondary font-rajdhani text-fluid-sm">
        {config.text}
      </span>
    </motion.div>
  );
}
