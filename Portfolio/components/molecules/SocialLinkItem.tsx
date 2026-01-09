'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface SocialLinkItemProps {
  name: string;
  url: string;
  icon: string;
  index: number;
  variant?: 'normal' | 'comingSoon' | 'newsletter' | 'pwa';
  onNewsletterClick?: () => void;
  onPWAClick?: () => void;
  onLinkClick?: (url: string, name: string) => void;
  comingSoonText?: string;
}

export default function SocialLinkItem({
  name,
  url,
  icon,
  index,
  variant = 'normal',
  onNewsletterClick,
  onPWAClick,
  onLinkClick,
  comingSoonText,
}: SocialLinkItemProps) {
  const iconSvg = variant === 'normal' ? (
    <svg className="size-icon-md text-text-muted group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
      <path d={icon} />
    </svg>
  ) : (
    <svg className="size-icon-md text-text-muted group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
    </svg>
  );

  const externalIcon = (
    <svg className="size-icon-sm ml-auto text-text-muted group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );

  if (variant === 'comingSoon') {
    return (
      <motion.button
        type="button"
        disabled
        className="relative flex items-center w-full bg-background-elevated/30 rounded-lg opacity-50 cursor-not-allowed group text-left"
        style={{ gap: fluidSizing.space.sm, padding: fluidSizing.space.sm }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.5, x: 0 }}
        transition={{ delay: 1 + index * 0.1 }}
      >
        {iconSvg}
        <span className="text-text-secondary font-rajdhani font-medium text-fluid-base">
          {name}
        </span>
        <span className="absolute -top-2 right-2 text-[10px] font-mono bg-white/10 border border-white/20 rounded px-2 py-0.5 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {comingSoonText}
        </span>
        {externalIcon}
      </motion.button>
    );
  }

  if (variant === 'newsletter') {
    return (
      <motion.button
        type="button"
        onClick={onNewsletterClick}
        className="flex items-center w-full bg-background-elevated/50 rounded-lg hover:bg-background-elevated transition-all duration-300 group text-left"
        style={{ gap: fluidSizing.space.sm, padding: fluidSizing.space.sm }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 + index * 0.1 }}
        whileHover={{ x: 5 }}
      >
        {iconSvg}
        <span className="text-text-secondary group-hover:text-text-primary font-rajdhani font-medium transition-colors text-fluid-base">
          {name}
        </span>
        {externalIcon}
      </motion.button>
    );
  }

  if (variant === 'pwa') {
    return (
      <motion.button
        type="button"
        onClick={onPWAClick}
        className="flex items-center w-full bg-background-elevated/50 rounded-lg hover:bg-background-elevated transition-all duration-300 group text-left"
        style={{ gap: fluidSizing.space.sm, padding: fluidSizing.space.sm }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 + index * 0.1 }}
        whileHover={{ x: 5 }}
      >
        {iconSvg}
        <span className="text-text-secondary group-hover:text-text-primary font-rajdhani font-medium transition-colors text-fluid-base">
          {name}
        </span>
        {externalIcon}
      </motion.button>
    );
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center bg-background-elevated/50 rounded-lg hover:bg-background-elevated transition-all duration-300 group"
      style={{ gap: fluidSizing.space.sm, padding: fluidSizing.space.sm }}
      onClick={() => onLinkClick?.(url, name)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 + index * 0.1 }}
      whileHover={{ x: 5 }}
    >
      {iconSvg}
      <span className="text-text-secondary group-hover:text-text-primary font-rajdhani font-medium transition-colors text-fluid-base">
        {name}
      </span>
      {externalIcon}
    </motion.a>
  );
}
