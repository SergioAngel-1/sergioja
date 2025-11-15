'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function IdentityContent() {
  const { t } = useLanguage();
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
        <div className="bg-[#ff0000] rounded-full animate-pulse" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
        <span className="text-white/60">{t('identity.available')}</span>
      </motion.div>

    </div>
  );
}
