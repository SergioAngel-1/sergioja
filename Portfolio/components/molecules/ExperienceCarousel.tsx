'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface ExperienceItem {
  label: string;
  value: string;
  icon: 'automation' | 'architecture' | 'integration' | 'strategy' | 'fullstack';
}

interface ExperienceCarouselProps {
  items: ExperienceItem[];
}

const icons = {
  automation: (
    <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  architecture: (
    <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  integration: (
    <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  strategy: (
    <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  fullstack: (
    <svg className="size-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
};

export default function ExperienceCarousel({ items }: ExperienceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { lowPerformanceMode } = usePerformance();

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000); // Cambiar cada 4 segundos

    return () => clearInterval(timer);
  }, [items.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const currentItem = items[currentIndex];

  return (
    <div className="relative h-full w-full max-w-full flex flex-col overflow-hidden" style={{ minHeight: 'clamp(220px, 30vw, 260px)' }}>
      {/* Main carousel card */}
      <div className="relative w-full max-w-full bg-background-elevated border border-white/30 rounded-lg overflow-hidden flex-1 flex items-center justify-center" style={{ padding: fluidSizing.space.lg }}>
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/5 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Content */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              
              if (swipe < -10000) {
                handleNext();
              } else if (swipe > 10000) {
                handlePrev();
              }
            }}
            className="relative z-10 text-center cursor-grab active:cursor-grabbing"
          >
            {/* Icon */}
            <motion.div
              className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/30 text-white"
              style={{ 
                width: fluidSizing.size.buttonLg, 
                height: fluidSizing.size.buttonLg,
                marginBottom: fluidSizing.space.md
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {icons[currentItem.icon]}
            </motion.div>

            {/* Label */}
            <div className="text-text-muted font-mono uppercase tracking-widest text-fluid-xs" style={{ marginBottom: fluidSizing.space.sm }}>
              {currentItem.label}
            </div>

            {/* Value */}
            <div className="text-text-secondary font-rajdhani leading-relaxed text-fluid-base" style={{ padding: `0 ${fluidSizing.space.md}` }}>
              {currentItem.value}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows - Hidden on mobile */}
        <button
          onClick={handlePrev}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 rounded-full bg-background-dark/50 border border-white/30 text-white hover:bg-white/10 hover:border-white/60 transition-all duration-300 z-20 items-center justify-center"
          style={{ left: fluidSizing.space.md, padding: fluidSizing.space.sm }}
          aria-label="Previous"
        >
          <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 rounded-full bg-background-dark/50 border border-white/30 text-white hover:bg-white/10 hover:border-white/60 transition-all duration-300 z-20 items-center justify-center"
          style={{ right: fluidSizing.space.md, padding: fluidSizing.space.sm }}
          aria-label="Next"
        >
          <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white/50" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
        <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white/50" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
      </div>

      {!lowPerformanceMode && (
        <div className="h-0.5 bg-background-elevated rounded-full overflow-hidden" style={{ marginTop: fluidSizing.space.sm }}>
          <motion.div
            className="h-full bg-gradient-to-r from-white to-cyber-red"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 4,
              ease: 'linear',
              repeat: Infinity,
            }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
}
