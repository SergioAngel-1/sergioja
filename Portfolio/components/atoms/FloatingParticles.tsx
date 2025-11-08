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

export default function FloatingParticles({ 
  count = 30, 
  color = 'bg-white',
  className = ''
}: FloatingParticlesProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { lowPerformanceMode } = usePerformance();
  const { matrixMode } = useMatrix();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reducir/aumentar partículas según el modo
  const effectiveCount = useMemo(() => {
    if (lowPerformanceMode) return Math.floor(count * 0.3); // 30% en modo bajo rendimiento
    if (matrixMode) return Math.floor(count * 3); // 300% en modo Matrix
    if (isMobile) return Math.floor(count * 0.5); // 50% en móvil
    return count;
  }, [count, isMobile, lowPerformanceMode, matrixMode]);

  // Generate particle positions once to avoid hydration mismatch
  const particles = useMemo(() => 
    Array.from({ length: effectiveCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: matrixMode ? 0.5 + Math.random() * 0.5 : 3 + Math.random() * 2,
      delay: matrixMode ? Math.random() * 0.3 : Math.random() * 2,
    })),
    [effectiveCount, matrixMode]
  );

  // No renderizar hasta que esté montado en el cliente
  if (!isMounted) {
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
            x: [0, Math.random() * 20 - 10, 0],
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
