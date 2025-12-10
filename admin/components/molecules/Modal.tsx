'use client';

import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  customHeader?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  customHeader,
  children,
  footer,
  maxWidth = '3xl',
  showCloseButton = true,
}: ModalProps) {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevenir bounce en iOS
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center" 
            style={{ 
              padding: fluidSizing.space.md,
              paddingTop: `calc(${fluidSizing.space.md} + env(safe-area-inset-top))`,
              paddingBottom: `calc(${fluidSizing.space.md} + env(safe-area-inset-bottom))`,
              paddingLeft: `calc(${fluidSizing.space.md} + env(safe-area-inset-left))`,
              paddingRight: `calc(${fluidSizing.space.md} + env(safe-area-inset-right))`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-2xl w-full ${maxWidthClasses[maxWidth]} flex flex-col`}
              style={{
                maxHeight: 'calc(90vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              {customHeader ? (
                <div className="border-b border-admin-primary/20 flex-shrink-0">
                  {customHeader}
                </div>
              ) : (
                <div 
                  className="flex items-center justify-between border-b border-admin-primary/20 flex-shrink-0" 
                  style={{ padding: fluidSizing.space.lg, gap: fluidSizing.space.md }}
                >
                  <h2 
                    className="font-orbitron font-bold text-admin-primary" 
                    style={{ fontSize: fluidSizing.text['2xl'] }}
                  >
                    {title}
                  </h2>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Icon name="plus" size={24} className="rotate-45" />
                    </button>
                  )}
                </div>
              )}

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {children}
              </div>

              {/* Footer - Fixed (opcional) */}
              {footer && (
                <div 
                  className="flex border-t border-admin-primary/20 flex-shrink-0" 
                  style={{ gap: fluidSizing.space.md, padding: fluidSizing.space.lg }}
                >
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
