'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useModal, GameModalConfig } from '@/lib/contexts/ModalContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface GameButtonProps {
  gameName: string;
  gameTitle: string;
  modalConfig?: Omit<GameModalConfig, 'title'>;
  color?: 'cyan' | 'purple' | 'red' | 'green';
  icon?: ReactNode;
  comingSoon?: boolean;
  onGameOpen?: () => void;
}

const colorClasses = {
  cyan: 'border-white/50 text-white hover:bg-white/10 hover:border-white',
  purple: 'border-text-secondary/50 text-text-secondary hover:bg-text-secondary/10 hover:border-text-secondary',
  red: 'border-cyber-red/50 text-cyber-red hover:bg-cyber-red/10 hover:border-cyber-red',
  green: 'border-green-500/50 text-green-500 hover:bg-green-500/10 hover:border-green-500',
};

export default function GameButton({ 
  gameName, 
  gameTitle, 
  modalConfig, 
  color = 'cyan',
  icon,
  comingSoon = false,
  onGameOpen
}: GameButtonProps) {
  const { lowPerformanceMode } = usePerformance();
  const { t } = useLanguage();
  const { openGameModal } = useModal();

  const handleOpen = () => {
    if (lowPerformanceMode || comingSoon) return;
    if (modalConfig) {
      // Call onGameOpen to close terminal modal on mobile
      if (onGameOpen) {
        onGameOpen();
      }
      openGameModal({
        title: gameTitle,
        ...modalConfig
      });
    }
  };
  
  const isDisabled = lowPerformanceMode || comingSoon;

  const defaultIcon = (
    <svg className="size-icon-sm flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <motion.button
      onClick={handleOpen}
      disabled={isDisabled}
      className={`inline-flex items-center rounded border transition-all duration-300 relative ${
        isDisabled
          ? 'border-text-muted/30 text-text-muted/50 cursor-not-allowed'
          : colorClasses[color]
      }`}
      style={{ gap: fluidSizing.space.xs, padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}` }}
      whileHover={isDisabled ? {} : { scale: 1.05 }}
      whileTap={isDisabled ? {} : { scale: 0.95 }}
      title={
        lowPerformanceMode 
          ? t('snake.requiresPerformance') 
          : comingSoon 
          ? t('snake.comingSoon')
          : `Play ${gameName}`
      }
    >
      {icon || defaultIcon}
      <span className="font-mono whitespace-nowrap text-fluid-xs">{gameTitle}</span>
      {comingSoon && (
        <span className="absolute bg-cyber-blue-cyan text-black rounded-full font-mono font-bold shadow-lg shadow-cyber-blue-cyan/50 animate-pulse uppercase text-fluid-xs" style={{ top: `calc(-1 * ${fluidSizing.space.xs})`, right: `calc(-1 * ${fluidSizing.space.xs})`, padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}` }}>
          {t('snake.comingSoon')}
        </span>
      )}
    </motion.button>
  );
}
