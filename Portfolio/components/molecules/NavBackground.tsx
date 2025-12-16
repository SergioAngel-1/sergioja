'use client';

import { motion } from 'framer-motion';

interface NavBackgroundProps {
  mounted: boolean;
  lowPerformanceMode: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export default function NavBackground({ 
  mounted, 
  lowPerformanceMode,
  orientation = 'vertical'
}: NavBackgroundProps) {
  const gradients = orientation === 'vertical' 
    ? [
        'linear-gradient(180deg, rgba(0,191,255,0.1) 0%, rgba(255,0,0,0.1) 100%)',
        'linear-gradient(180deg, rgba(255,0,0,0.1) 0%, rgba(139,0,255,0.1) 100%)',
        'linear-gradient(180deg, rgba(139,0,255,0.1) 0%, rgba(0,191,255,0.1) 100%)',
      ]
    : [
        'linear-gradient(90deg, rgba(0,191,255,0.1) 0%, rgba(255,0,0,0.1) 100%)',
        'linear-gradient(90deg, rgba(255,0,0,0.1) 0%, rgba(139,0,255,0.1) 100%)',
        'linear-gradient(90deg, rgba(139,0,255,0.1) 0%, rgba(0,191,255,0.1) 100%)',
      ];

  return (
    <>
      {/* Animated background gradient */}
      {mounted && (
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={lowPerformanceMode ? {} : {
            background: gradients,
          }}
          transition={lowPerformanceMode ? {} : { duration: 10, repeat: Infinity }}
        />
      )}

      {/* Decorative lines */}
      {orientation === 'vertical' ? (
        <>
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-30" />
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-30" />
        </>
      ) : (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
      )}
    </>
  );
}
