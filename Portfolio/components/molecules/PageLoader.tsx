'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
            className="flex flex-col items-center justify-center py-20"
          >
            {/* Simple spinner */}
            <div className="relative w-16 h-16 mb-4">
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
              className="text-text-muted font-mono text-sm"
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
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Spinning loader */}
            <div className="relative w-24 h-24">
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
                  className="w-3 h-3 bg-white rounded-full"
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
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-mono text-sm text-white">
                {'<'} CARGANDO {'/>'} 
              </span>
              <motion.span
                className="flex gap-1"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="w-1 h-1 bg-white rounded-full" />
                <span className="w-1 h-1 bg-white rounded-full" />
                <span className="w-1 h-1 bg-cyber-red rounded-full" />
              </motion.span>
            </motion.div>

            {/* Progress bar */}
            <div className="w-64 h-1 bg-background-elevated rounded-full overflow-hidden">
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
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-white" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-white" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-white" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-cyber-red" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
