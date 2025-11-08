'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface TerminalBackButtonProps {
  onBack: () => void;
  delay?: number;
}

export default function TerminalBackButton({ onBack, delay = 0 }: TerminalBackButtonProps) {
  const { t } = useLanguage();

  return (
    <motion.a
      onClick={(e) => {
        e.preventDefault();
        onBack();
      }}
      className="inline-flex items-center gap-1 sm:gap-1.5 text-white hover:text-white text-[10px] sm:text-xs cursor-pointer relative z-10 group"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span className="font-mono whitespace-nowrap relative">
        {t('common.back')}
        <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
      </span>
    </motion.a>
  );
}
