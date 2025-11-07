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

export default function HexButton({ 
  position, 
  icon, 
  label,
  onClick,
  delay = 0,
  isActive = false
}: HexButtonProps) {
  const positionClasses = {
    'top-left': 'top-8 left-8',
    'top-right': 'top-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'bottom-right': 'bottom-8 right-8',
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
        className="relative group cursor-pointer focus:outline-none"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
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
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.line
              key={i}
              x1="50"
              y1="50"
              x2={50 + Math.cos((angle * Math.PI) / 180) * 35}
              y2={50 + Math.sin((angle * Math.PI) / 180) * 35}
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
          className="absolute inset-0 flex items-center justify-center text-white"
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
          className={`absolute ${
            position.includes('left') ? 'left-full ml-4' : 'right-full mr-4'
          } top-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap`}
          initial={{ opacity: 0, x: position.includes('left') ? -10 : 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white text-black px-4 py-2 rounded-lg shadow-2xl border border-white">
            <span className="font-orbitron text-xs font-bold tracking-wider uppercase">
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
