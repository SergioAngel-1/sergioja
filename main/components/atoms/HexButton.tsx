'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HexButtonProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  icon: ReactNode;
  label: string;
  onClick: () => void;
  delay?: number;
  isActive?: boolean;
}

// Valores precalculados estáticos para evitar diferencias servidor/cliente
const linePositions = [
  { x2: 85, y2: 50 },                    // 0°
  { x2: 67.5, y2: 80.31088913245535 },  // 60°
  { x2: 32.5, y2: 80.31088913245535 },  // 120°
  { x2: 15, y2: 50 },                    // 180°
  { x2: 32.5, y2: 19.689110867544652 }, // 240°
  { x2: 67.5, y2: 19.689110867544652 }  // 300°
];

export default function HexButton({ 
  position, 
  icon, 
  label,
  onClick,
  delay = 0,
  isActive = false
}: HexButtonProps) {
  const positionClasses = {
    'top-left': 'top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8',
    'top-right': 'top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8',
    'bottom-left': 'bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8',
    'bottom-right': 'bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8',
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50`}
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
        className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center cursor-pointer group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* SVG Hexágono */}
        <svg 
          width="100" 
          height="100" 
          viewBox="0 0 100 100"
          className="drop-shadow-2xl"
        >
          {/* Hexágono de fondo */}
          <motion.polygon
            points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
            fill="#000000"
            stroke="none"
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: isActive ? 0.5 : 0.3,
            }}
            transition={{
              duration: 0.3
            }}
          />
          
          {/* Hexágono borde exterior - más grueso */}
          <motion.polygon
            points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={isActive ? "3.5" : "2.5"}
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
            points="50,18 78,33 78,67 50,82 22,67 22,33"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity={isActive ? "0.6" : "0.4"}
            animate={{ 
              strokeDashoffset: [0, -24],
              opacity: isActive ? 0.6 : 0.4
            }}
            transition={{
              strokeDashoffset: {
                duration: 4,
                repeat: Infinity,
                ease: 'linear'
              },
              opacity: {
                duration: 0.3
              }
            }}
          />

          {/* Círculo central cuando está activo */}
          <motion.circle
            cx="50"
            cy="50"
            r="28"
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
              x1="50"
              y1="50"
              x2={pos.x2}
              y2={pos.y2}
              stroke="#FFFFFF"
              strokeWidth="0.5"
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
          className="absolute inset-0 flex items-center justify-center text-white scale-75 sm:scale-90 md:scale-100"
          animate={{
            scale: isActive ? 1.15 : 1,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          {icon}
        </motion.div>

        {/* Indicador de estado activo */}
        <motion.div
          className={`absolute -bottom-2 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-lg ${
            position.includes('left') ? '-left-2' : '-right-2'
          }`}
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
            className="w-2 h-2 rounded-full bg-black"
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

        {/* Label flotante mejorado */}
        <motion.div
          className={`hidden sm:block absolute ${
            position.includes('left') ? 'left-full ml-2 sm:ml-3 md:ml-4' : 'right-full mr-2 sm:mr-3 md:mr-4'
          } top-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap`}
          initial={{ opacity: 0, x: position.includes('left') ? -10 : 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white text-black px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg shadow-2xl border border-white">
            <span className="font-orbitron text-[10px] sm:text-xs font-bold tracking-wider uppercase">
              {label}
            </span>
          </div>
        </motion.div>

        {/* Glow effect en hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </motion.div>
  );
}
