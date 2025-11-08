'use client';

import { motion } from 'framer-motion';
import TerminalBackButton from '@/components/atoms/TerminalBackButton';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useMatrix } from '@/lib/contexts/MatrixContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface TerminalHelpProps {
  onCommandSelect?: (command: string) => void;
  onBack?: () => void;
}

export default function TerminalHelp({ onCommandSelect, onBack }: TerminalHelpProps) {
  const { t } = useLanguage();
  const { matrixMode } = useMatrix();

  const commands = [
    { name: t('terminal.pages'), description: t('terminal.helpPages') },
    { name: t('terminal.games'), description: t('terminal.helpGames') },
    { name: matrixMode ? 'matrix --disable' : 'matrix', description: t('terminal.helpMatrix') },
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
        {commands.map((cmd, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={onCommandSelect ? 'cursor-pointer hover:text-white transition-colors' : ''}
            onClick={() => onCommandSelect?.(cmd.name)}
          >
            <span className="text-white">{cmd.name}</span> — {cmd.description}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
