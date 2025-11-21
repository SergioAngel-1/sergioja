'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLogger } from '@/lib/hooks/useLogger';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  icon,
  children,
  position = 'top-left'
}: ModalProps) {

  const log = useLogger('Modal');
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      const isCoarse = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
      const isNarrow = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
      setIsMobile(isCoarse || isNarrow);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isOpen) {
      log.interaction('open_modal', title || position);
    } else {
      log.interaction('close_modal', title || position);
    }
  }, [isOpen, title, position]);

  useEffect(() => {
    if (!isOpen) return;
    const body = document.body as HTMLBodyElement;
    const prevOverflow = body.style.overflow;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;
    const scrollY = window.scrollY;
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    return () => {
      body.style.overflow = prevOverflow;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const handleClose = () => {
    log.interaction('modal_close_click', title || position);
    onClose();
  };

  // Determinar posición del modal según el hexágono
  const getModalPositionStyles = () => {
    const baseOffset = fluidSizing.space.lg;
    const modalOffset = 'clamp(1rem, 10vw, 10rem)';
    const hexButtonSize = 'clamp(4rem, 6vw, 6rem)';
    const gap = fluidSizing.space.md;

    switch (position) {
      case 'top-left':
        return isMobile
          ? { top: `calc(${baseOffset} + ${hexButtonSize} + ${gap} + env(safe-area-inset-top))`, left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto' }
          : { top: `calc(${baseOffset} + env(safe-area-inset-top))`, left: `calc(${modalOffset} + env(safe-area-inset-left))` };
      case 'top-right':
        return isMobile
          ? { top: `calc(${baseOffset} + ${hexButtonSize} + ${gap} + env(safe-area-inset-top))`, left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto' }
          : { top: `calc(${baseOffset} + env(safe-area-inset-top))`, right: `calc(${modalOffset} + env(safe-area-inset-right))` };
      case 'bottom-left':
        return isMobile
          ? { bottom: `calc(${baseOffset} + ${hexButtonSize} + ${gap} + env(safe-area-inset-bottom))`, left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto' }
          : { bottom: `calc(${baseOffset} + env(safe-area-inset-bottom))`, left: `calc(${modalOffset} + env(safe-area-inset-left))` };
      case 'bottom-right':
        return isMobile
          ? { bottom: `calc(${baseOffset} + ${hexButtonSize} + ${gap} + env(safe-area-inset-bottom))`, left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto' }
          : { bottom: `calc(${baseOffset} + env(safe-area-inset-bottom))`, right: `calc(${modalOffset} + env(safe-area-inset-right))` };
      default:
        return { top: `calc(${baseOffset} + env(safe-area-inset-top))`, left: `calc(${modalOffset} + env(safe-area-inset-left))` };
    }
  };


  const getModalMaxHeight = () => {
    const baseOffset = fluidSizing.space.lg;
    const hexButtonSize = 'clamp(4rem, 6vw, 6rem)';
    const gap = fluidSizing.space.md;
    const topReserved = `calc(${baseOffset} + ${hexButtonSize} + ${gap} + env(safe-area-inset-top))`;
    const bottomReserved = `calc(${baseOffset} + ${hexButtonSize} + ${gap} + env(safe-area-inset-bottom))`;
    return `calc(var(--vh-form) - ${topReserved} - ${bottomReserved})`;
  };


  // Animación de entrada según posición
  // Los modales vienen desde el lado del HexButton
  const getInitialX = () => {
    return position.includes('left') ? -100 : 100;
  };

  // Animación adaptativa (mobile vs desktop) para mayor fluidez en móviles
  // Eliminado rotateY y scale para evitar texto borroso causado por transformaciones 3D
  const initialAnim = isMobile
    ? { x: getInitialX() * 0.6, opacity: 0 }
    : { x: getInitialX(), opacity: 0 };
  const animateAnim = isMobile
    ? { x: 0, opacity: 1 }
    : { x: 0, opacity: 1 };
  const exitAnim = isMobile
    ? { x: getInitialX() * 0.5, opacity: 0 }
    : { x: getInitialX(), opacity: 0 };
  const transitionAnim = isMobile
    ? { duration: 0.2, ease: 'easeOut' }
    : { duration: 0.3, ease: [0.4, 0, 0.2, 1] };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-cyber-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50"
            style={{
              ...getModalPositionStyles(),
              width: 'min(calc(100vw - 2rem), clamp(320px, 35vw, 380px))',
              maxWidth: 'calc(100vw - 2rem)',
              maxHeight: isMobile ? getModalMaxHeight() : 'calc(var(--vh-app) - 8rem)',
              // No height fija en mobile: que el modal crezca hasta maxHeight y, si lo supera, scrollee el contenido
              zIndex: isMobile ? 45 : undefined,
              overflow: isMobile ? 'hidden' : undefined
            }}
            initial={initialAnim}
            animate={animateAnim}
            exit={exitAnim}
            transition={transitionAnim}
          >
            <div 
              className="relative bg-black/95 backdrop-blur-xl border-2 border-white/30 shadow-2xl" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                maxHeight: isMobile ? getModalMaxHeight() : 'calc(var(--vh-app) - 8rem)',
                height: '100%',
                overflow: 'hidden',
                // Anti-blur optimizations for text rendering
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}
            >
              {/* Header */}
              <div className="relative border-b border-white/10" style={{ padding: `${fluidSizing.space.lg} ${fluidSizing.space.lg}` }}>
                {/* Líneas decorativas de fondo */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-full h-px bg-white" />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-white" />
                </div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: fluidSizing.space.md }}>
                    {/* Icono */}
                    {icon && (
                      <motion.div
                        className="text-white"
                        animate={{
                          scale: [1, 1.08, 1],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      >
                        {icon}
                      </motion.div>
                    )}
                    
                    {/* Título */}
                    <div>
                      <h2 className="font-orbitron font-black text-white tracking-wider uppercase text-fluid-lg">
                        {title}
                      </h2>
                      <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginTop: fluidSizing.space.xs }}>
                        <motion.div
                          className="rounded-full bg-white"
                          style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }}
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [1, 0.4, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                        <span className="font-mono text-white/60 tracking-widest uppercase text-fluid-xs">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón cerrar */}
                  <motion.button
                    onClick={handleClose}
                    className="border border-white/30 hover:border-white/60 flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                    style={{ 
                      width: fluidSizing.size.buttonMd, 
                      height: fluidSizing.size.buttonMd,
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                    <motion.svg 
                      className="size-icon-md text-white/70 group-hover:text-white transition-colors relative z-10" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </motion.svg>
                  </motion.button>
                </div>
              </div>

              {/* Contenido scrollable */}
              <div className="overflow-y-auto custom-scrollbar flex-1" style={{ padding: `${fluidSizing.space.lg} ${fluidSizing.space.lg}`, WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain', minHeight: 0 }}>
                <div className="font-mono text-white/90 leading-relaxed text-fluid-sm">
                  {children}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 bg-white/[0.02]" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-white/50 tracking-widest text-fluid-xs">
                    SergioJA
                  </span>
                  <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-white/40"
                        style={{ height: `${(i + 1) * 3}px` }}
                        animate={{ 
                          opacity: [0.4, 1, 0.4],
                          scaleY: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 1.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: 'easeInOut'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Decoración de esquinas */}
              <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white/40" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
              <div className="absolute top-0 right-0 border-t-2 border-r-2 border-white/40" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
              <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-white/40" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
              <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white/40" style={{ width: fluidSizing.space.lg, height: fluidSizing.space.lg }} />
              
              {/* Líneas decorativas */}
              <motion.div 
                className="absolute top-0 left-1/4 w-1/2 h-px bg-white/30"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-0 right-1/4 w-1/2 h-px bg-white/30"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
