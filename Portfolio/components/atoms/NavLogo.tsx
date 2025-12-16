'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface NavLogoProps {
  lowPerformanceMode?: boolean;
}

export default function NavLogo({ lowPerformanceMode = false }: NavLogoProps) {
  return (
    <motion.div
      className="relative z-10"
      style={{ marginBottom: fluidSizing.space.xl }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <a
        href="https://sergioja.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative">
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-lg bg-white blur-md"
            animate={lowPerformanceMode ? {} : {
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={lowPerformanceMode ? {} : { duration: 2, repeat: Infinity }}
          />
          
          {/* Main logo */}
          <div 
            className="relative bg-gradient-to-br from-black to-gray-900 rounded-lg flex items-center justify-center border border-white/50 size-button-md"
          >
            <span 
              className="font-orbitron font-bold text-white text-fluid-sm"
            >
              SJ
            </span>
            
            {/* Corner accents */}
            <div 
              className="absolute border-t-2 border-l-2 border-white" 
              style={{
                top: `calc(-1 * ${fluidSizing.space.xs})`,
                left: `calc(-1 * ${fluidSizing.space.xs})`,
                width: fluidSizing.space.sm,
                height: fluidSizing.space.sm
              }}
            />
            <div 
              className="absolute border-b-2 border-r-2 border-white" 
              style={{
                bottom: `calc(-1 * ${fluidSizing.space.xs})`,
                right: `calc(-1 * ${fluidSizing.space.xs})`,
                width: fluidSizing.space.sm,
                height: fluidSizing.space.sm
              }}
            />
          </div>
        </div>
      </a>
    </motion.div>
  );
}
