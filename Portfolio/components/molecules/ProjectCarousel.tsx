'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import ProjectCard from './ProjectCard';
import type { Project } from '../../../shared/types';

interface ProjectCarouselProps {
  projects: Project[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { lowPerformanceMode } = usePerformance();

  // Timer + sync with CSS progress bar
  const DURATION_MS = 8000;
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number>(Date.now());
  const remainingRef = useRef<number>(DURATION_MS);
  const advancingRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const safeAdvance = () => {
    if (projects.length <= 1) return;
    if (advancingRef.current) return;
    advancingRef.current = true;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  // Reset timer on slide change and (re)start if not hovered
  useEffect(() => {
    advancingRef.current = false;
    remainingRef.current = DURATION_MS;
    startRef.current = Date.now();
    clearTimer();
    if (projects.length <= 1) return;
    if (!isHovered) {
      timerRef.current = window.setTimeout(() => {
        safeAdvance();
      }, remainingRef.current);
    }
    return clearTimer;
  }, [currentIndex, projects.length, isHovered]);

  // Pause/resume timer on hover with remaining time logic
  useEffect(() => {
    if (projects.length <= 1) return;
    if (isHovered) {
      const elapsed = Date.now() - startRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      clearTimer();
    } else {
      startRef.current = Date.now();
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        safeAdvance();
      }, remainingRef.current);
    }
  }, [isHovered, projects.length]);

  const handleNext = () => {
    if (projects.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    if (projects.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  if (projects.length === 0) {
    return null;
  }

  const currentProject = projects[currentIndex];

  return (
    <div className="relative w-full px-8 md:px-10">
      {/* Main carousel */}
      <div 
        className="relative w-full max-w-[1000px] mx-auto overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
            className="cursor-grab active:cursor-grabbing"
          >
            <ProjectCard project={currentProject} viewMode="grid" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {projects.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-background-dark/90 backdrop-blur-sm border border-white/40 text-white hover:bg-white/5 hover:border-white/60 shadow-lg transition-all duration-300 group"
              aria-label="Previous project"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute -right-6 md:-right-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-background-dark/90 backdrop-blur-sm border border-white/40 text-white hover:bg-white/5 hover:border-white/60 shadow-lg transition-all duration-300 group"
              aria-label="Next project"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Progress bar */}
      {!lowPerformanceMode && projects.length > 1 && (
        <div className="mt-4 h-0.5 bg-background-elevated rounded-full overflow-hidden max-w-[1000px] mx-auto">
          <div
            className={`h-full bg-gradient-to-r from-white to-cyber-red animate-progress ${isHovered ? 'animation-paused' : ''}`}
            key={currentIndex}
            onAnimationIteration={() => { clearTimer(); safeAdvance(); }}
          />
        </div>
      )}

      {/* Project counter */}
      <div className="mt-4 text-center">
        <span className="text-xs font-mono text-text-muted">
          {currentIndex + 1} / {projects.length}
        </span>
      </div>
    </div>
  );
}
