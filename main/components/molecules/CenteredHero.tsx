'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

import Loader from '@/components/atoms/Loader';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';

function Loading3D() {
  const { t } = useLanguage();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader size="md" message={t('loader.initializing')} />
    </div>
  );
}

const Model3D = dynamic(() => import('@/components/3d/Model3D'), {
  ssr: false,
  loading: () => <Loading3D />,
});

export default function CenteredHero({ onModelIntroComplete }: { onModelIntroComplete?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalize mouse position to -1 to 1 range
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
          }}
        />
        
        {/* 3D Model Container with blurred gray background */}
        <motion.div 
          className="absolute rounded-full border-4 border-cyber-black overflow-hidden"
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
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Loader size="sm" />
            </div>
          }>
            <Model3D mousePosition={mousePosition} onAnimationComplete={onModelIntroComplete} />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
