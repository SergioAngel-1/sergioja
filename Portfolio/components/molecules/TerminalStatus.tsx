'use client';

import { motion } from 'framer-motion';
import TerminalBackButton from '@/components/atoms/TerminalBackButton';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface TerminalStatusProps {
  onBack?: () => void;
}

export default function TerminalStatus({ onBack }: TerminalStatusProps = {}) {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-cyber-red">❯</span>
          <span className="text-white" style={{ marginLeft: fluidSizing.space.sm }}>{t('terminal.status')}</span>
        </motion.div>
        {onBack && <TerminalBackButton onBack={onBack} delay={0.2} />}
      </div>

      <motion.div
        className="grid grid-cols-2"
        style={{ paddingLeft: fluidSizing.space.md, gap: fluidSizing.space.sm }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Availability Card */}
        <motion.div
          className="bg-background-elevated border border-green-400/20 rounded-lg hover:border-green-400/40 transition-all duration-300"
          style={{ padding: fluidSizing.space.md }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.sm }}>
            <span className="bg-green-400 rounded-full animate-pulse flex-shrink-0" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
            <span className="text-text-muted uppercase font-mono truncate text-fluid-xs">{t('terminal.availability')}</span>
          </div>
          <div className="font-bold text-green-400 font-orbitron truncate text-fluid-lg">
            {t('terminal.online')}
          </div>
        </motion.div>

        {/* Stack Card */}
        <motion.div
          className="bg-background-elevated border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300"
          style={{ padding: fluidSizing.space.md }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-text-muted uppercase font-mono truncate text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>{t('terminal.stack')}</div>
          <div className="font-bold text-white font-orbitron truncate text-fluid-lg">
            Next.js + Node.js
          </div>
        </motion.div>

        {/* Location Card */}
        <motion.div
          className="bg-background-elevated border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300"
          style={{ padding: fluidSizing.space.md }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-text-muted uppercase font-mono truncate text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>{t('terminal.location')}</div>
          <div className="font-bold text-white font-orbitron truncate text-fluid-lg">
            {t('about.locationValue')}
          </div>
        </motion.div>

        {/* Uptime Card */}
        <motion.div
          className="bg-background-elevated border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300"
          style={{ padding: fluidSizing.space.md }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-text-muted uppercase font-mono truncate text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>{t('terminal.uptime')}</div>
          <div className="font-bold text-white font-orbitron truncate text-fluid-lg">
            {new Date().getFullYear() - 2020}+ {t('terminal.years')}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
