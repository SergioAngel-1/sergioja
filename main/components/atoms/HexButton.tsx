'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fluidSizing } from '@/lib/fluidSizing';

interface HexButtonProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  icon: ReactNode;
  label: string;
  onClick: () => void;
  delay?: number;
  isActive?: boolean;
  showMenuLabel?: boolean;
  menuLabel?: string;
  anyModalOpen?: boolean;
}

// Valores precalculados estáticos para evitar diferencias servidor/cliente (escalados 1.3x)
const linePositions = [
  { x2: 110.5, y2: 65 },                    // 0°
  { x2: 87.75, y2: 104.40415587219195 },   // 60°
  { x2: 42.25, y2: 104.40415587219195 },   // 120°
  { x2: 19.5, y2: 65 },                     // 180°
  { x2: 42.25, y2: 25.595844127808048 },   // 240°
  { x2: 87.75, y2: 25.595844127808048 }    // 300°
];

export default function HexButton({ 
  position, 
  icon, 
  label,
  onClick,
  delay = 0,
  isActive = false,
  showMenuLabel = false,
  menuLabel = '',
  anyModalOpen = false
}: HexButtonProps) {
  const positionStyles = {
    'top-left': { 
      top: `calc(${fluidSizing.space.lg} + env(safe-area-inset-top))`, 
      left: `calc(${fluidSizing.space.lg} + env(safe-area-inset-left))` 
    },
    'top-right': { 
      top: `calc(${fluidSizing.space.lg} + env(safe-area-inset-top))`, 
      right: `calc(${fluidSizing.space.lg} + env(safe-area-inset-right))` 
    },
    'bottom-left': { 
      bottom: `calc(${fluidSizing.space.lg} + env(safe-area-inset-bottom))`, 
      left: `calc(${fluidSizing.space.lg} + env(safe-area-inset-left))` 
    },
    'bottom-right': { 
      bottom: `calc(${fluidSizing.space.lg} + env(safe-area-inset-bottom))`, 
      right: `calc(${fluidSizing.space.lg} + env(safe-area-inset-right))` 
    },
  };

  return (
    <motion.div
      className="fixed z-50 flex flex-col items-center"
      style={positionStyles[position]}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        duration: 1, 
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
    >
      <motion.button
        onClick={onClick}
        className="relative flex items-center justify-center cursor-pointer group"
        style={{ 
          width: 'clamp(5.2rem, 7.8vw, 7.8rem)', 
          height: 'clamp(5.2rem, 7.8vw, 7.8rem)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Backdrop blur layer */}
        <div 
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(50% 5%, 90% 27.5%, 90% 72.5%, 50% 95%, 10% 72.5%, 10% 27.5%)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            backgroundColor: isActive ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.25)',
            zIndex: 0
          }}
        />
        <motion.div
          className={`absolute pointer-events-none transition-opacity duration-200 ${ (showMenuLabel && menuLabel) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100' }`}
          style={{
            ...(position.includes('left') 
              ? { left: `calc(100% + ${fluidSizing.space.xs})` } 
              : { right: `calc(100% + ${fluidSizing.space.xs})` }),
            top: '50%',
            zIndex: 3,
          }}
        >
          <div className="relative -translate-y-1/2">
            <div 
              className="bg-black/40 backdrop-blur-sm border border-white/20 rounded px-2 py-1"
              style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="font-mono text-white/70 text-fluid-xs tracking-wider uppercase leading-none">
                {showMenuLabel && menuLabel ? menuLabel : label}
              </span>
            </div>
          </div>
        </motion.div>
        {/* SVG Hexágono */}
        <svg 
          width="130" 
          height="130" 
          viewBox="0 0 130 130"
          className="drop-shadow-2xl absolute"
          style={{ zIndex: 1 }}
        >
          
          {/* Hexágono borde exterior - más grueso */}
          <motion.polygon
            points="65,6.5 117,35.75 117,94.25 65,123.5 13,94.25 13,35.75"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={isActive ? "4.5" : "3.25"}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: isActive ? 1 : 0.8,
              strokeWidth: isActive ? 3.5 : 2.5
            }}
            transition={{ 
              pathLength: { duration: 1.5, delay: delay + 0.2 },
              strokeWidth: { duration: 0.3 },
              opacity: { duration: 0.3 }
            }}
          />

          {/* Hexágono interior con dash animado */}
          <motion.polygon
            points="65,23.4 101.4,42.9 101.4,87.1 65,106.6 28.6,87.1 28.6,42.9"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeDasharray="4 4"
            opacity={isActive ? "0.6" : "0.4"}
            animate={isActive ? { strokeDashoffset: [0, -24], opacity: 0.6 } : { strokeDashoffset: 0, opacity: 0.4 }}
            transition={isActive ? {
              strokeDashoffset: { duration: 4, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 0.3 }
            } : {
              opacity: { duration: 0.3 }
            }}
          />

          {/* Círculo central cuando está activo */}
          <motion.circle
            cx="65"
            cy="65"
            r="36.4"
            fill="#FFFFFF"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isActive ? 1 : 0,
              opacity: isActive ? 0.15 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />

          {/* Líneas decorativas en las esquinas */}
          {linePositions.map((pos, i) => (
            <motion.line
              key={i}
              x1="65"
              y1="65"
              x2={pos.x2}
              y2={pos.y2}
              stroke="#FFFFFF"
              strokeWidth="0.65"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: isActive ? 0.6 : 0,
                opacity: isActive ? 0.3 : 0
              }}
              transition={{ 
                duration: 0.4,
                delay: i * 0.05
              }}
            />
          ))}
        </svg>

        {/* Icono central */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-white"
          style={{ zIndex: 99, filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.6))' }}
          animate={{
            scale: isActive ? 1.8 : 1.5,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          {icon}
        </motion.div>

        {/* Indicador de estado activo */}
        <motion.div
          className="absolute rounded-full bg-white flex items-center justify-center shadow-lg"
          style={{
            width: fluidSizing.space.md,
            height: fluidSizing.space.md,
            ...(position.includes('top') && { top: `calc(-1 * ${fluidSizing.space.xs})` }),
            ...(position.includes('bottom') && { bottom: `calc(-1 * ${fluidSizing.space.xs})` }),
            ...(position.includes('left') && { left: `calc(-1 * ${fluidSizing.space.xs})` }),
            ...(position.includes('right') && { right: `calc(-1 * ${fluidSizing.space.xs})` }),
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            type: 'spring',
            stiffness: 300
          }}
        >
          <motion.div
            className="rounded-full bg-black"
            style={{ width: fluidSizing.space.xs, height: fluidSizing.space.xs }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* Glow effect en hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
            zIndex: 2,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </motion.div>
  );
}
