'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-0 bg-background-surface/90 backdrop-blur-sm border border-white/30 rounded-lg hidden md:block"
            style={{ right: 'clamp(3.5rem, 5vw, 4rem)', padding: fluidSizing.space.md, minWidth: 'clamp(140px, 15vw, 160px)' }}
          >
            <p className="text-text-muted font-mono text-fluid-xs" style={{ marginBottom: fluidSizing.space.xs }}>
              {language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
            </p>
            <p className="text-text-muted text-fluid-xs">
              {language === 'es' ? 'ES → EN' : 'EN → ES'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleLanguage}
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        className="relative rounded-full border-2 bg-background-surface border-white text-white hover:bg-white hover:text-black flex items-center justify-center group shadow-lg transition-all duration-300"
        style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Language Icon */}
        <svg
          className="size-icon-md"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>

        {/* Language Label */}
        <span className="absolute left-1/2 -translate-x-1/2 font-mono text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-bold text-fluid-xs" style={{ bottom: `calc(-1 * ${fluidSizing.space.xl})` }}>
          {language.toUpperCase()}
        </span>
      </motion.button>
    </div>
  );
}
