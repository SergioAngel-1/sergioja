'use client';

import { usePerformance } from '@/lib/contexts/PerformanceContext';

/**
 * Pure CSS scanline overlay — replaces the Framer Motion version
 * that was causing constant repaints at 10fps across the full viewport.
 * Uses a CSS animation with will-change: background-position for GPU compositing.
 */
export default function ScanlineOverlay() {
  const { lowPerformanceMode } = usePerformance();

  if (lowPerformanceMode) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline-scroll {
          0% { background-position-y: 0; }
          100% { background-position-y: 4px; }
        }
      `}} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.02) 50%)',
          backgroundSize: '100% 4px',
          willChange: 'background-position',
          animationName: 'scanline-scroll',
          animationDuration: '0.1s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'steps(1)',
        }}
      />
    </>
  );
}
