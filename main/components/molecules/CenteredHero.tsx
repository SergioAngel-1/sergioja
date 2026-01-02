'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Loader from '@/components/atoms/Loader';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const Model3D = dynamic(() => import('@/components/3d/Model3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <Loader size="sm" />
    </div>
  )
});

export default function CenteredHero({ onModelIntroComplete }: { onModelIntroComplete?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const pendingPositionRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Optimized mouse tracking: Use RAF to batch updates at monitor refresh rate
    // This allows smooth 3D tracking while preventing excessive re-renders
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalize mouse position to -1 to 1 range
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      
      // Store pending position
      pendingPositionRef.current = { x, y };
      
      // Schedule update on next animation frame if not already scheduled
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          if (pendingPositionRef.current) {
            setMousePosition(pendingPositionRef.current);
            pendingPositionRef.current = null;
          }
          rafIdRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  // No dynamic centering needed; wrapper compensates safe-areas symmetrically

  if (!mounted) return null;

  return (
    <div className="relative">
      <div
        className="relative"
        style={{
          width: fluidSizing.size.heroContainer,
          height: fluidSizing.size.heroContainer,
        }}
      >
        {/* 3D Model Container */}
        <div
          className="absolute rounded-full"
          style={{
            width: '80%',
            height: '80%',
            left: '10%',
            top: '10%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            willChange: 'filter',
            transform: 'translateZ(0)',
          }}
        />
        
        {/* 3D Model Container with blurred gray background */}
        <motion.div 
          className="absolute rounded-full border-4 border-white overflow-hidden"
          style={{
            width: '80%',
            height: '80%',
            left: '10%',
            top: '10%',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.4, 
            ease: 'easeOut',
            type: 'spring',
            stiffness: 200,
            damping: 20
          }}
        >
          <Suspense 
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <Loader size="sm" />
              </div>
            }
          >
            {/* Renderizar modelo solo después de que el contenedor sea visible */}
            <Model3D mousePosition={mousePosition} onAnimationComplete={onModelIntroComplete} />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
