'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  color?: 'red' | 'blue' | 'purple' | 'cyan';
  children: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const colorConfig = {
  red: {
    border: 'border-cyber-red/30',
    accent: 'bg-cyber-red',
    text: 'text-cyber-red',
    glow: 'shadow-glow-red',
  },
  blue: {
    border: 'border-cyber-blue/30',
    accent: 'bg-cyber-blue',
    text: 'text-cyber-blue',
    glow: 'shadow-glow-blue',
  },
  purple: {
    border: 'border-cyber-purple/30',
    accent: 'bg-cyber-purple',
    text: 'text-cyber-purple',
    glow: 'shadow-glow-purple',
  },
  cyan: {
    border: 'border-cyber-blue-cyan/30',
    accent: 'bg-cyber-blue-cyan',
    text: 'text-cyber-blue-cyan',
    glow: 'shadow-glow-blue',
  },
};

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  icon,
  color = 'cyan',
  children,
  position = 'top-left'
}: ModalProps) {
  const colors = colorConfig[color];

  // Determinar posición del modal según el hexágono
  const getModalPosition = () => {
    switch(position) {
      case 'top-left':
        return 'top-24 left-8';
      case 'top-right':
        return 'top-24 right-8';
      case 'bottom-left':
        return 'bottom-8 left-8';
      case 'bottom-right':
        return 'bottom-8 right-8';
      default:
        return 'top-24 left-8';
    }
  };

  // Animación de entrada según posición
  const getInitialX = () => {
    return position.includes('left') ? -300 : 300;
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
            className={`fixed ${getModalPosition()} z-50 w-[320px] max-h-[calc(100vh-200px)]`}
            initial={{ x: getInitialX(), opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: getInitialX(), opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={`relative bg-white/98 backdrop-blur-xl border-2 ${colors.border} rounded-2xl shadow-2xl overflow-hidden`}>
              {/* Header con gradiente */}
              <div className="relative px-5 py-4 border-b border-cyber-black/10">
                {/* Gradiente de fondo sutil */}
                <div className={`absolute inset-0 ${colors.accent} opacity-[0.03]`} />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Icono */}
                    {icon && (
                      <motion.div
                        className={`${colors.text}`}
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        {icon}
                      </motion.div>
                    )}
                    
                    {/* Título */}
                    <div>
                      <h2 className="font-orbitron text-base font-black text-cyber-black tracking-wider">
                        {title}
                      </h2>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <motion.div
                          className={`w-1.5 h-1.5 rounded-full ${colors.accent}`}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                        <span className="font-mono text-[9px] text-cyber-black/50 tracking-wide uppercase">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón cerrar */}
                  <motion.button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg hover:bg-cyber-black/5 flex items-center justify-center transition-all duration-300 group"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4 text-cyber-black/50 group-hover:text-cyber-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Contenido scrollable */}
              <div className="px-5 py-4 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
                <div className="font-mono text-xs text-cyber-black/80 leading-relaxed">
                  {children}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-cyber-black/5 bg-cyber-black/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-cyber-black/40 tracking-wide">
                    ID: SJ-{position.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-0.5 ${colors.accent} opacity-30`}
                        style={{ height: `${(i + 1) * 2.5}px` }}
                        animate={{ 
                          opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Decoración de esquinas */}
              <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${colors.border} rounded-tl-2xl`} />
              <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${colors.border} rounded-br-2xl`} />
              
              {/* Línea decorativa superior */}
              <div className={`absolute top-0 left-1/4 right-1/4 h-0.5 ${colors.accent} opacity-20`} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
