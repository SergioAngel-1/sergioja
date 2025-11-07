'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Model3D = dynamic(() => import('@/components/3d/Model3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 border-4 border-cyber-black border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function CenteredHero() {
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

  if (!mounted) return null;

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div className="relative w-[400px] h-[400px] sm:w-[500px] sm:h-[500px]">
        
        {/* Simplified outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-cyber-black"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 360 }}
          transition={{ 
            scale: { duration: 0.8, ease: 'easeOut' },
            opacity: { duration: 0.5 },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear', delay: 0.8 }
          }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute rounded-full border-2 border-white opacity-30"
          style={{ 
            width: '85%', 
            height: '85%',
            left: '7.5%',
            top: '7.5%'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3, rotate: -360 }}
          transition={{ 
            scale: { duration: 0.8, delay: 0.2, ease: 'easeOut' },
            opacity: { duration: 0.5, delay: 0.2 },
            rotate: { duration: 15, repeat: Infinity, ease: 'linear', delay: 1 }
          }}
        />

        {/* 3D Model Container */}
        <motion.div 
          className="absolute rounded-full bg-white border-4 border-cyber-black shadow-glow-black overflow-hidden"
          style={{
            width: '70%',
            height: '70%',
            left: '15%',
            top: '15%'
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
              <div className="w-16 h-16 border-4 border-cyber-black border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <Model3D mousePosition={mousePosition} />
          </Suspense>
        </motion.div>

        {/* Cardinal points with animated dots */}
        {[
          { position: 'top', rotation: 0 },
          { position: 'right', rotation: 90 },
          { position: 'bottom', rotation: 180 },
          { position: 'left', rotation: 270 }
        ].map((item, index) => (
          <motion.div
            key={item.position}
            className={`absolute ${
              item.position === 'top' ? '-top-6 left-1/2 -translate-x-1/2' :
              item.position === 'right' ? '-right-6 top-1/2 -translate-y-1/2' :
              item.position === 'bottom' ? '-bottom-6 left-1/2 -translate-x-1/2' :
              '-left-6 top-1/2 -translate-y-1/2'
            }`}
            initial={{ scale: 0, opacity: 0, y: item.position === 'top' ? -20 : item.position === 'bottom' ? 20 : 0, x: item.position === 'left' ? -20 : item.position === 'right' ? 20 : 0 }}
            animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
            transition={{ 
              delay: 0.6 + index * 0.1, 
              duration: 0.6,
              type: 'spring',
              stiffness: 300,
              damping: 15
            }}
          >
            <motion.div 
              className="w-3 h-3 rounded-full bg-white shadow-lg"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.5
              }}
            />
          </motion.div>
        ))}

        {/* Corner accents */}
        {[
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right'
        ].map((corner, index) => (
          <motion.div
            key={corner}
            className={`absolute w-8 h-8 ${
              corner === 'top-left' ? 'border-l-2 border-t-2 -top-4 -left-4' :
              corner === 'top-right' ? 'border-r-2 border-t-2 -top-4 -right-4' :
              corner === 'bottom-left' ? 'border-l-2 border-b-2 -bottom-4 -left-4' :
              'border-r-2 border-b-2 -bottom-4 -right-4'
            } border-white`}
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              delay: 1 + index * 0.08, 
              duration: 0.5,
              type: 'spring',
              stiffness: 250,
              damping: 18
            }}
          />
        ))}
      </div>
    </div>
  );
}
