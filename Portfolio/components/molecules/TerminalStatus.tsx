'use client';

import { motion } from 'framer-motion';
import TerminalBackButton from '@/components/atoms/TerminalBackButton';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface TerminalStatusProps {
  onBack?: () => void;
}

export default function TerminalStatus({ onBack }: TerminalStatusProps = {}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-cyber-red">❯</span>
          <span className="text-white ml-2">{t('terminal.status')}</span>
        </motion.div>
        {onBack && <TerminalBackButton onBack={onBack} delay={0.2} />}
      </div>

      <motion.div
        className="pl-3 sm:pl-6 grid grid-cols-2 gap-2 sm:gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Availability Card */}
        <motion.div
          className="bg-background-elevated border border-green-400/20 rounded-lg p-2 sm:p-3 hover:border-green-400/40 transition-all duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
            <span className="text-[9px] sm:text-xs text-text-muted uppercase font-mono truncate">{t('terminal.availability')}</span>
          </div>
          <div className="text-sm sm:text-lg font-bold text-green-400 font-orbitron truncate">
            {t('terminal.online')}
          </div>
        </motion.div>

        {/* Stack Card */}
        <motion.div
          className="bg-background-elevated border border-white/20 rounded-lg p-2 sm:p-3 hover:border-white/40 transition-all duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-[9px] sm:text-xs text-text-muted uppercase font-mono mb-1 sm:mb-2 truncate">{t('terminal.stack')}</div>
          <div className="text-sm sm:text-lg font-bold text-white font-orbitron truncate">
            Next.js + Node.js
          </div>
        </motion.div>

        {/* Location Card */}
        <motion.div
          className="bg-background-elevated border border-white/20 rounded-lg p-2 sm:p-3 hover:border-white/40 transition-all duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-[9px] sm:text-xs text-text-muted uppercase font-mono mb-1 sm:mb-2 truncate">{t('terminal.location')}</div>
          <div className="text-sm sm:text-lg font-bold text-white font-orbitron truncate">
            {t('about.locationValue')}
          </div>
        </motion.div>

        {/* Uptime Card */}
        <motion.div
          className="bg-background-elevated border border-white/20 rounded-lg p-2 sm:p-3 hover:border-white/40 transition-all duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-[9px] sm:text-xs text-text-muted uppercase font-mono mb-1 sm:mb-2 truncate">{t('terminal.uptime')}</div>
          <div className="text-sm sm:text-lg font-bold text-white font-orbitron truncate">
            {new Date().getFullYear() - 2020}+ {t('terminal.years')}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
