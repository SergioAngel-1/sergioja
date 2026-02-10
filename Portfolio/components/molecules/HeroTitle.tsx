'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface HeroTitleProps {
  typedText: string;
}

export default function HeroTitle({ typedText }: HeroTitleProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Title with glitch effect */}
      <motion.h1
        className="font-orbitron font-black mb-fluid-md relative leading-tight"
        style={{ fontSize: fluidSizing.text['6xl'] }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <span className="relative inline-block" style={{ color: 'transparent', WebkitTextStroke: '2px white' }}>
          {t('home.firstName')}
          <motion.span
            className="absolute inset-0"
            style={{ color: 'transparent', WebkitTextStroke: '2px black' } as any}
            animate={{
              x: [0, -5, 5, -3, 3, 0],
              y: [0, 2, -2, 1, -1, 0],
              opacity: [0, 0.8, 0.8, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatDelay: 4,
            }}
          >
            {t('home.firstName')}
          </motion.span>
        </span>
        <br />
        <span
          className="text-transparent bg-clip-text bg-gradient-to-r from-white via-text-secondary to-white animate-gradient relative inline-block"
          style={{ WebkitTextStroke: '1px white' }}
        >
          {t('home.lastName')}
        </span>
      </motion.h1>

      {/* Animated subtitle with typing effect */}
      <motion.div
        className="font-orbitron text-text-secondary mb-fluid-md tracking-wider flex items-center"
        style={{ fontSize: fluidSizing.text['2xl'], height: fluidSizing.size.buttonLg }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <span className="text-cyber-red" style={{ marginRight: fluidSizing.space.sm }}>{'>'}</span>
        <span className="text-white truncate">{typedText}</span>
        <motion.span
          className="inline-block bg-white flex-shrink-0"
          style={{
            width: fluidSizing.space.xs,
            height: fluidSizing.text['2xl'],
            marginLeft: fluidSizing.space.xs,
          }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="font-rajdhani text-text-secondary mb-fluid-xl max-w-xl leading-relaxed text-fluid-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {t('home.tagline')}
      </motion.p>
    </>
  );
}
