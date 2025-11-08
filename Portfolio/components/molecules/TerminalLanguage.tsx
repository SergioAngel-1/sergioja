'use client';

import { motion } from 'framer-motion';
import TerminalBackButton from '@/components/atoms/TerminalBackButton';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface TerminalLanguageProps {
  onBack?: () => void;
}

export default function TerminalLanguage({ onBack }: TerminalLanguageProps) {
  const { t, language, setLanguage } = useLanguage();

  const languages = [
    { 
      code: 'es', 
      name: 'Español', 
      nativeName: 'Español',
      flag: '🇪🇸',
      region: 'España / Latinoamérica'
    },
    { 
      code: 'en', 
      name: 'English', 
      nativeName: 'English',
      flag: '🇬🇧',
      region: 'United States / UK'
    },
  ];

  const handleLanguageSelect = (langCode: 'es' | 'en') => {
    setLanguage(langCode);
    // Volver al menú principal después de cambiar el idioma
    if (onBack) {
      setTimeout(() => onBack(), 300);
    }
  };

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
          <span className="text-white ml-2">{t('terminal.language')}</span>
        </motion.div>
        {onBack && <TerminalBackButton onBack={onBack} delay={0.2} />}
      </div>

      <motion.div
        className="pl-3 sm:pl-6 text-text-muted text-[10px] sm:text-xs mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t('terminal.selectLanguage')}
      </motion.div>

      <motion.div
        className="pl-3 sm:pl-6 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {languages.map((lang, index) => {
          const isActive = language === lang.code;
          
          return (
            <motion.button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code as 'es' | 'en')}
              className={`w-full text-left px-2.5 sm:px-4 py-2 sm:py-3 rounded border transition-all duration-300 ${
                isActive
                  ? 'bg-white/10 border-white text-white'
                  : 'bg-background-dark/50 border-text-muted/30 text-text-secondary hover:border-white/50 hover:bg-background-elevated'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <span className="text-xl sm:text-2xl flex-shrink-0">{lang.flag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs sm:text-sm font-bold truncate">
                      {lang.nativeName}
                    </div>
                    <div className="text-[10px] sm:text-xs text-text-muted mt-0.5 truncate">
                      {lang.region}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 flex-shrink-0"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-mono hidden sm:inline">{t('terminal.active')}</span>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div
        className="pl-3 sm:pl-6 pt-3 border-t border-white/20 text-text-muted text-[10px] sm:text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="leading-tight">{t('terminal.languageNote')}</span>
        </div>
      </motion.div>
    </div>
  );
}
