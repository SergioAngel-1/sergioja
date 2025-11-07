'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

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

  // Determinar posición del modal según el hexágono
  // Los modales se abren al lado opuesto (donde hay espacio)
  const getModalPosition = () => {
    switch(position) {
      case 'top-left':
        return 'top-4 left-4 sm:top-6 sm:left-24 md:top-8 md:left-40'; // Responsive
      case 'top-right':
        return 'top-4 right-4 sm:top-6 sm:right-24 md:top-8 md:right-40'; // Responsive
      case 'bottom-left':
        return 'bottom-4 left-4 sm:bottom-6 sm:left-24 md:bottom-8 md:left-40'; // Responsive
      case 'bottom-right':
        return 'bottom-4 right-4 sm:bottom-6 sm:right-24 md:bottom-8 md:right-40'; // Responsive
      default:
        return 'top-4 left-4 sm:top-8 sm:left-40';
    }
  };


  // Animación de entrada según posición
  // Los modales vienen desde el lado del HexButton
  const getInitialX = () => {
    return position.includes('left') ? -100 : 100;
  };

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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`fixed ${getModalPosition()} z-50 w-[calc(100vw-2rem)] sm:w-[340px] md:w-[380px] max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-200px)]`}
            initial={{ x: getInitialX(), opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ x: getInitialX(), opacity: 0, scale: 0.8, rotateY: 15 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          >
            <div className="relative bg-black/95 backdrop-blur-xl border-2 border-white/30 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-white/10">
                {/* Líneas decorativas de fondo */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-full h-px bg-white" />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-white" />
                </div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
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
                      <h2 className="font-orbitron text-lg font-black text-white tracking-wider uppercase">
                        {title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-white"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [1, 0.4, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                        <span className="font-mono text-[10px] text-white/60 tracking-widest uppercase">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón cerrar */}
                  <motion.button
                    onClick={onClose}
                    className="w-10 h-10 border border-white/30 hover:border-white/60 flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                    <motion.svg 
                      className="w-5 h-5 text-white/70 group-hover:text-white transition-colors relative z-10" 
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
              <div className="px-6 py-5 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
                <div className="font-mono text-sm text-white/90 leading-relaxed">
                  {children}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
                    SYS/{position.replace('-', '_').toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1">
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
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/40" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/40" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/40" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/40" />
              
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
