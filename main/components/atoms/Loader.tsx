'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/fluidSizing';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export default function Loader({ 
  size = 'md', 
  message,
  fullScreen = false 
}: LoaderProps) {
  const sizes = {
    sm: { outer: 40, inner: 32, border: 2, text: 'text-fluid-xs' },
    md: { outer: 80, inner: 64, border: 3, text: 'text-fluid-sm' },
    lg: { outer: 120, inner: 96, border: 4, text: 'text-fluid-base' }
  };

  const config = sizes[size];

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center" style={{ gap: fluidSizing.space.lg }}>
        {/* Hexagonal Loader */}
        <div className="relative" style={{ width: config.outer, height: config.outer }}>
          {/* Outer rotating hexagon */}
          <motion.svg
            width={config.outer}
            height={config.outer}
            viewBox="0 0 100 100"
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <polygon
              points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
              fill="none"
              stroke="white"
              strokeWidth={config.border}
              opacity="0.3"
            />
          </motion.svg>

          {/* Middle rotating hexagon (opposite direction) */}
          <motion.svg
            width={config.inner}
            height={config.inner}
            viewBox="0 0 100 100"
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <polygon
              points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
              fill="none"
              stroke="white"
              strokeWidth={config.border}
              opacity="0.5"
            />
          </motion.svg>

          {/* Inner pulsing circle */}
          <motion.div
            className="absolute bg-white rounded-full"
            style={{
              width: config.outer / 4,
              height: config.outer / 4,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Corner dots */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const radius = config.outer / 2;
            const x = radius + radius * 0.9 * Math.cos((angle - 90) * Math.PI / 180);
            const y = radius + radius * 0.9 * Math.sin((angle - 90) * Math.PI / 180);
            
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
              />
            );
          })}
        </div>

        {/* Loading message */}
        {message && (
          <motion.div
            className={`${config.text} text-white/80 font-mono tracking-wider uppercase`}
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {message}
            <motion.span
              animate={{
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              ...
            </motion.span>
          </motion.div>
        )}

        {/* Scanline effect */}
        {fullScreen && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.02) 50%)',
              backgroundSize: '100% 4px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '0px 4px']
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
      </div>
    </div>
  );
}
