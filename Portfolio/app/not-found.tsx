'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import Button from '@/components/atoms/Button';
import GlowEffect from '@/components/atoms/GlowEffect';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { usePerformance } from '@/lib/contexts/PerformanceContext';

export default function NotFound() {
  const { t } = useLanguage();
  const { lowPerformanceMode } = usePerformance();
  const [mounted, setMounted] = useState(false);
  
  // Generate random widths only on client
  const barWidths = useMemo(() => {
    if (!mounted) return [40, 50, 60, 45, 55];
    return Array.from({ length: 5 }, () => Math.random() * 60 + 20);
  }, [mounted]);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pl-0 md:pl-20">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-15" />

      {/* Animated glow effects */}
      <GlowEffect
        color="white"
        size="lg"
        position={{ top: '33%', right: '33%' }}
        opacity={0.15}
        duration={4}
        animationType="pulse"
      />

      <GlowEffect
        color="white"
        size="lg"
        position={{ bottom: '33%', left: '33%' }}
        opacity={0.1}
        duration={5}
        delay={1}
        animationType="pulse"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 Number with glitch effect */}
          <motion.h1
            className="font-orbitron text-6xl sm:text-8xl md:text-[12rem] font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-text-secondary to-white"
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
            <p className="text-text-secondary text-base sm:text-lg font-rajdhani max-w-2xl mx-auto">
              {t('notfound.message')}
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
                className="h-1 bg-cyber-red"
                style={{ width: `${barWidths[i]}px` }}
                animate={lowPerformanceMode ? {} : {
                  opacity: [0.3, 1, 0.3],
                  scaleX: [1, 1.2, 1],
                }}
                transition={lowPerformanceMode ? {} : {
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Navigation buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link href="/">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                {t('notfound.backHome')}
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                {t('notfound.viewProjects')}
              </Button>
            </Link>
          </motion.div>

          {/* Additional info */}
          <motion.p
            className="mt-12 text-text-muted text-xs sm:text-sm font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {t('notfound.errorCodeLabel')}: <span className="text-white">{t('notfound.errorCode')}</span> | {t('notfound.statusLabel')}: {' '}
            <span className="text-white">404</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Floating particles */}
      <FloatingParticles count={20} color="bg-white" />
    </div>
  );
}
