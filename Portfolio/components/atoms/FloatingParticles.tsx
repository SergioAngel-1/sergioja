'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { useMatrix } from '@/lib/contexts/MatrixContext';
import { useIsMobile } from '@/lib/hooks/useMediaQuery';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  className?: string;
}

/**
 * Seeded random number generator para generar valores deterministas
 * Evita hydration mismatch entre servidor y cliente
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function FloatingParticles({ 
  count = 30, 
  color = 'bg-white',
  className = ''
}: FloatingParticlesProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { lowPerformanceMode } = usePerformance();
  const { matrixMode } = useMatrix();
  const isMobile = useIsMobile();

  // Reducir/aumentar partículas según el modo
  const effectiveCount = useMemo(() => {
    if (lowPerformanceMode) return Math.floor(count * 0.3); // 30% en modo bajo rendimiento
    if (matrixMode) return Math.floor(count * 1.5); // 150% en modo Matrix (reducido de 300%)
    if (isMobile) return Math.floor(count * 0.5); // 50% en móvil
    return count;
  }, [count, isMobile, lowPerformanceMode, matrixMode]);

  // Generar partículas con posiciones deterministas (evita hydration mismatch)
  const particles = useMemo(() => {
    return Array.from({ length: effectiveCount }, (_, i) => ({
      id: i,
      left: seededRandom(i * 1.1) * 100,
      top: seededRandom(i * 2.3) * 100,
      duration: matrixMode 
        ? 0.5 + seededRandom(i * 3.7) * 0.5 
        : 3 + seededRandom(i * 4.1) * 2,
      delay: matrixMode 
        ? seededRandom(i * 5.3) * 0.3 
        : seededRandom(i * 6.7) * 2,
      xOffset: seededRandom(i * 7.9) * 20 - 10,
    }));
  }, [effectiveCount, matrixMode]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // No renderizar hasta que esté montado en el cliente
  if (!isMounted || particles.length === 0) {
    return null;
  }

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute w-1 h-1 ${color} rounded-full ${className}`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={lowPerformanceMode ? {} : matrixMode ? {
            y: [0, -60, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          } : {
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={lowPerformanceMode ? {} : {
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
          suppressHydrationWarning
        />
      ))}
    </>
  );
}
