'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface PageLoaderProps {
  variant?: 'full' | 'simple';
  isLoading?: boolean;
  message?: string;
}

export default function PageLoader({ 
  variant = 'full', 
  isLoading: externalLoading,
  message = 'CARGANDO'
}: PageLoaderProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const pathname = usePathname();

  // Solo usar el loading interno si no se pasa isLoading como prop
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  useEffect(() => {
    // Solo activar el loading automático si variant es 'full' y no hay control externo
    if (variant === 'full' && externalLoading === undefined) {
      // Activar el loader inmediatamente
      setInternalLoading(true);
      
      // Esperar al siguiente frame para verificar el contenido
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Verificar si el contenido ya está cargado (solo en el cliente)
          if (typeof window !== 'undefined') {
            const mainElement = document.querySelector('main');
            const hasContent = mainElement && mainElement.children.length > 1; // > 1 porque el loader también está en main
            
            if (hasContent) {
              // Si ya hay contenido, ocultar el loader inmediatamente
              setInternalLoading(false);
            } else {
              // Si no hay contenido, esperar un tiempo mínimo
              setTimeout(() => {
                setInternalLoading(false);
              }, 300);
            }
          } else {
            // En el servidor, ocultar después de 300ms
            setTimeout(() => {
              setInternalLoading(false);
            }, 300);
          }
        });
      });

      return () => cancelAnimationFrame(rafId);
    }
  }, [pathname, variant, externalLoading]);

  // Versión simplificada para cargas de datos
  if (variant === 'simple') {
    return (
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center"
            style={{ paddingTop: fluidSizing.space['2xl'], paddingBottom: fluidSizing.space['2xl'] }}
          >
            {/* Simple spinner */}
            <div className="relative" style={{ width: fluidSizing.size.buttonLg, height: fluidSizing.size.buttonLg, marginBottom: fluidSizing.space.md }}>
              <motion.div
                className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <motion.div
                className="absolute inset-2 border-4 border-white/20 border-b-white rounded-full"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>

            {/* Loading text */}
            <motion.p
              className="text-text-muted font-mono text-fluid-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {message}...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Versión completa para transiciones de página
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background-dark"
        >
          {/* Cyber grid background */}
          <div className="absolute inset-0 cyber-grid opacity-20" />

          {/* Animated glow effect */}
          <motion.div
            className="absolute w-96 h-96 bg-white rounded-full blur-[150px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Loader content */}
          <div className="relative z-10 flex flex-col items-center" style={{ gap: fluidSizing.space.lg }}>
            {/* Spinning loader */}
            <div className="relative" style={{ width: 'clamp(5rem, 8vw, 6rem)', height: 'clamp(5rem, 8vw, 6rem)' }}>
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              {/* Middle ring */}
              <motion.div
                className="absolute inset-2 border-4 border-white/20 border-r-white rounded-full"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              {/* Inner ring */}
              <motion.div
                className="absolute inset-4 border-4 border-cyber-red/30 border-b-cyber-red rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Center dot */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="bg-white rounded-full"
                  style={{ width: fluidSizing.space.md, height: fluidSizing.space.md }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            </div>

            {/* Loading text */}
            <motion.div
              className="flex items-center"
              style={{ gap: fluidSizing.space.sm }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-mono text-white text-fluid-sm">
                {'<'} CARGANDO {'/>'} 
              </span>
              <motion.span
                className="flex"
                style={{ gap: fluidSizing.space.xs }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="bg-white rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.xs }} />
                <span className="bg-white rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.xs }} />
                <span className="bg-cyber-red rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.xs }} />
              </motion.span>
            </motion.div>

            {/* Progress bar */}
            <div className="h-1 bg-background-elevated rounded-full overflow-hidden" style={{ width: 'clamp(12rem, 30vw, 16rem)' }}>
              <motion.div
                className="h-full bg-gradient-to-r from-white via-text-secondary to-white"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 0.8,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute border-t-2 border-l-2 border-white" style={{ top: fluidSizing.space['2xl'], left: fluidSizing.space['2xl'], width: fluidSizing.space['2xl'], height: fluidSizing.space['2xl'] }} />
          <div className="absolute border-t-2 border-r-2 border-white" style={{ top: fluidSizing.space['2xl'], right: fluidSizing.space['2xl'], width: fluidSizing.space['2xl'], height: fluidSizing.space['2xl'] }} />
          <div className="absolute border-b-2 border-l-2 border-white" style={{ bottom: fluidSizing.space['2xl'], left: fluidSizing.space['2xl'], width: fluidSizing.space['2xl'], height: fluidSizing.space['2xl'] }} />
          <div className="absolute border-b-2 border-r-2 border-cyber-red" style={{ bottom: fluidSizing.space['2xl'], right: fluidSizing.space['2xl'], width: fluidSizing.space['2xl'], height: fluidSizing.space['2xl'] }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
