'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { trackOutboundLink } from '@/lib/analytics';
import type { Profile } from '@/lib/types';

export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

interface IdentityContentProps {
  profile: Profile | null;
  availabilityStatus: AvailabilityStatus;
}

export default function IdentityContent({ profile, availabilityStatus }: IdentityContentProps) {
  const { t } = useLanguage();
  const availabilityCopy = useMemo(() => {
    const map: Record<AvailabilityStatus, { text: string; color: string }> = {
      available: {
        text: t('identity.available') || 'Let\'s build something great.',
        color: '#00F7C0',
      },
      busy: {
        text: t('identity.busy') || 'Currently focused on active collaborations.',
        color: '#FACC15',
      },
      unavailable: {
        text: t('identity.unavailable') || 'Temporarily not taking new projects.',
        color: '#FE4C4C',
      },
    };
    return map[availabilityStatus];
  }, [availabilityStatus, t]);
  
  // Portfolio card
  const isDev = typeof window !== 'undefined' && process.env.NODE_ENV === 'development';
  const portfolioCard = {
    id: 'portfolio',
    title: t('nav.portfolio'),
    description: t('nav.portfolioDesc'),
    href: isDev ? 'http://localhost:3000' : 'https://portfolio.sergioja.com',
  } as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.lg }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}
      >
        <h3 className="font-bold text-white text-fluid-lg">
          {t('identity.title')}
        </h3>
        <div className="h-px bg-gradient-to-r from-white/50 via-white/20 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}
        className="text-white/80 leading-relaxed text-fluid-sm"
      >
        <p>
          {t('identity.paragraph1')}
        </p>
        <p>
          {t('identity.paragraph2')}
        </p>
      </motion.div>

      {/* Availability indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center text-fluid-xs"
        style={{ gap: fluidSizing.space.sm }}
      >
        <motion.div
          className="rounded-full"
          style={{
            width: fluidSizing.space.sm,
            height: fluidSizing.space.sm,
            backgroundColor: availabilityCopy.color,
            boxShadow: `0 0 12px ${availabilityCopy.color}`,
          }}
          animate={{ opacity: [0.9, 0.4, 0.9], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        <span className="text-white/60">{availabilityCopy.text}</span>
      </motion.div>

      {/* Portfolio Card */}
      <motion.a
        href={portfolioCard.href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="group flex items-center rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
        style={{ gap: fluidSizing.space.md, padding: fluidSizing.space.md }}
        onClick={() => trackOutboundLink(portfolioCard.href, 'Portfolio')}
      >
        {/* Icono */}
        <div className="rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors text-white" style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}>
          <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-9 4h6" />
          </svg>
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-fluid-sm">{portfolioCard.title}</h4>
          <p className="text-white/60 truncate text-fluid-sm">{portfolioCard.description}</p>
        </div>

        {/* Flecha */}
        <div className="text-white/40 group-hover:text-white/60 transition-colors">
          <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </motion.a>

    </div>
  );
}
