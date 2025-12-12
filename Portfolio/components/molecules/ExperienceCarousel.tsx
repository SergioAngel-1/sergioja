'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { fluidSizing, clamp } from '@/lib/utils/fluidSizing';

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
  const [isDragging, setIsDragging] = useState(false);
  const AUTO_MS = 8000;
  const PROGRESS_SEC = AUTO_MS / 1000;

  // Resettable autoplay to keep timing consistent after manual interactions
  useEffect(() => {
    if (isDragging) return;
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, AUTO_MS);
    return () => clearTimeout(timer);
  }, [currentIndex, items.length, isDragging]);

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
    <div className="relative h-full w-full max-w-full flex flex-col overflow-hidden" style={{ minHeight: clamp('280px', '35vw', '360px') }}>
      {/* Main carousel card */}
      <div className="relative w-full max-w-full bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden flex-1 flex items-center justify-center hover:border-white/40 transition-all duration-500" style={{ padding: fluidSizing.space.xl }}>
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-white/3"
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
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
            dragElastic={0.5}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x * velocity.x;
              const swipeThreshold = 50;
              
              // More sensitive swipe detection for mobile
              if (Math.abs(offset.x) > swipeThreshold) {
                if (offset.x < 0) {
                  handleNext();
                } else {
                  handlePrev();
                }
              } else if (swipe < -5000) {
                handleNext();
              } else if (swipe > 5000) {
                handlePrev();
              }
              setIsDragging(false);
            }}
            className="relative z-10 text-center cursor-grab active:cursor-grabbing touch-pan-y"
            style={{ touchAction: 'pan-y' }}
          >
            {/* Icon with enhanced styling */}
            <motion.div
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/40 text-white shadow-lg"
              style={{ 
                width: clamp('56px', '8vw', '72px'),
                height: clamp('56px', '8vw', '72px'),
                marginBottom: fluidSizing.space.lg,
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.05)',
              }}
              whileHover={{ scale: 1.15, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {icons[currentItem.icon]}
            </motion.div>

            {/* Label with better hierarchy */}
            <div className="text-white/80 font-orbitron uppercase tracking-[0.2em] font-bold" style={{ fontSize: clamp('10px', '1.2vw', '13px'), marginBottom: fluidSizing.space.md, letterSpacing: '0.15em' }}>
              {currentItem.label}
            </div>

            {/* Value with improved readability */}
            <div className="text-text-secondary font-rajdhani leading-relaxed" style={{ fontSize: clamp('13px', '1.8vw', '16px'), padding: `0 ${fluidSizing.space.lg}`, lineHeight: '1.7' }}>
              {currentItem.value}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Dot indicators - inside card */}
        <div className="absolute z-20 left-1/2 -translate-x-1/2 flex items-center justify-center" style={{ bottom: fluidSizing.space.sm, gap: fluidSizing.space.xs }}>
          {items.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              className="relative rounded-full transition-all duration-300 overflow-hidden bg-background-elevated"
              style={{
                width: clamp('16px', '1.6vw', '20px'),
                height: clamp('3px', '0.5vw', '4px'),
                opacity: currentIndex === index ? 1 : 0.6,
              }}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentIndex === index ? 'true' : 'false'}
            >
              {currentIndex === index && !lowPerformanceMode && !isDragging && (
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{
                    duration: PROGRESS_SEC,
                    ease: 'linear',
                  }}
                  key={currentIndex}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Corner accents - Enhanced */}
        <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white/60" style={{ width: fluidSizing.space.xl, height: fluidSizing.space.xl }} />
        <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white/60" style={{ width: fluidSizing.space.xl, height: fluidSizing.space.xl }} />
      </div>
      
    </div>
  );
}
