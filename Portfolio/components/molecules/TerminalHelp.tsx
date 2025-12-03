'use client';

import { motion } from 'framer-motion';
import TerminalBackButton from '@/components/atoms/TerminalBackButton';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface TerminalHelpProps {
  onCommandSelect?: (command: string) => void;
  onBack?: () => void;
  disableMatrix?: boolean;
}

export default function TerminalHelp({ onCommandSelect, onBack, disableMatrix = true }: TerminalHelpProps) {
  const { t } = useLanguage();

  const commands = [
    { name: t('terminal.projects'), description: t('terminal.helpProjects') },
    { name: t('terminal.games'), description: t('terminal.helpGames') },
    { name: 'matrix', description: t('terminal.helpMatrix'), disabled: disableMatrix },
    { name: t('terminal.language'), description: t('terminal.helpLanguage') },
    { name: t('terminal.status'), description: t('terminal.helpStatus') },
  ];

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
          <span className="text-white" style={{ marginLeft: fluidSizing.space.sm }}>commands</span>
        </motion.div>
        {onBack && <TerminalBackButton onBack={onBack} delay={0.2} />}
      </div>

      <motion.div
        className="text-text-muted text-fluid-xs"
        style={{ paddingLeft: fluidSizing.space.xl, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xs }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {commands.map((cmd: { name: string; description: string; disabled?: boolean }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`group relative flex items-center gap-2 ${cmd.disabled 
              ? 'cursor-not-allowed' 
              : (onCommandSelect ? 'cursor-pointer hover:text-white transition-colors' : '')}`}
            onClick={() => { if (!cmd.disabled) onCommandSelect?.(cmd.name); }}
          >
            <span className={cmd.disabled ? 'text-white/70' : 'text-white'}>{cmd.name}</span>
            <span className={cmd.disabled ? 'text-white/50' : 'text-white/80'}>— {cmd.description}</span>
            {cmd.disabled && (
              <span className="ml-2 text-[10px] font-mono bg-white/10 border border-white/20 rounded px-2 py-0.5 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {t('performance.comingSoon')}
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
