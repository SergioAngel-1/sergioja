'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface FloatingNavParticlesProps {
  mounted: boolean;
  lowPerformanceMode: boolean;
}

export default function FloatingNavParticles({ 
  mounted, 
  lowPerformanceMode 
}: FloatingNavParticlesProps) {
  const particles = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      duration: 8 + i * 2,
      delay: i * 1.5,
    })),
    []
  );

  if (!mounted || lowPerformanceMode) return null;

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-cyber-red rounded-full z-0"
          style={{ left: '50%', top: '65%' }}
          animate={{
            y: [0, '-60vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
}
