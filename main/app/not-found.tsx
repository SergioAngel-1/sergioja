'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import HexagonGrid from '@/components/atoms/HexagonGrid';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Hexagon grid background */}
      <HexagonGrid />

      {/* Data streams */}
      

      {/* Animated glow effects */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute top-1/3 right-1/3 w-64 h-64 md:w-96 md:h-96 bg-white rounded-full blur-[90px] md:blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
        className="absolute bottom-1/3 left-1/3 w-64 h-64 md:w-96 md:h-96 bg-white rounded-full blur-[90px] md:blur-[120px]"
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 404 Number with glitch effect */}
            <motion.h1
              className="font-orbitron text-6xl sm:text-8xl md:text-[12rem] font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              404
            </motion.h1>

            {/* Error message */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
                {t('notfound.title')}
              </h2>
              <p className="text-gray-400 text-base sm:text-lg font-rajdhani max-w-2xl mx-auto">
                {t('notfound.description')}
              </p>
            </motion.div>

            {/* Glitch lines decoration */}
            <motion.div
              className="flex justify-center gap-2 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 bg-white"
                  style={{ width: `${Math.random() * 60 + 20}px` }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scaleX: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>

            {/* Navigation button */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link href="/">
                <motion.button
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white text-white font-orbitron font-bold text-sm sm:text-base rounded-lg transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('notfound.backHome')}
                </motion.button>
              </Link>
            </motion.div>

            {/* Additional info */}
            <motion.p
              className="mt-12 text-gray-500 text-xs sm:text-sm font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {t('notfound.errorCodeLabel')}: <span className="text-white">{t('notfound.errorCode')}</span> | {t('notfound.statusLabel')}: <span className="text-white">{t('notfound.subtitle')}</span>
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
