'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { logger } from '@/lib/logger';

interface ProjectPreviewViewerProps {
  demoUrl?: string;
  images?: string[];
  title: string;
  lowPerformanceMode: boolean;
  viewMode: 'demo' | 'image';
  selectedImageIndex: number;
  onBackToDemo: () => void;
}

export default function ProjectPreviewViewer({
  demoUrl,
  images,
  title,
  lowPerformanceMode,
  viewMode,
  selectedImageIndex,
  onBackToDemo,
}: ProjectPreviewViewerProps) {
  const { t } = useLanguage();
  const [showIframe, setShowIframe] = useState(false);
  const [imageError, setImageError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Validar URL y determinar si mostrar iframe
  useEffect(() => {
    if (!demoUrl || viewMode !== 'demo' || lowPerformanceMode) {
      setShowIframe(false);
      return;
    }

    // Validar que la URL sea válida
    try {
      const url = new URL(demoUrl);
      // Solo permitir http y https
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        setShowIframe(true);
        logger.debug('Loading iframe', { url: demoUrl }, 'ProjectPreviewViewer');
        
        // Timeout para detectar si el iframe no carga
        const timeout = setTimeout(() => {
          // Verificar si el iframe realmente cargó
          const iframe = iframeRef.current;
          if (iframe) {
            try {
              // Intentar acceder al contentDocument para verificar si cargó
              // Si falla por CORS o X-Frame-Options, mostrará el fallback
              const doc = iframe.contentDocument || iframe.contentWindow?.document;
              if (!doc || doc.readyState !== 'complete') {
                logger.warn('Iframe did not load completely, showing fallback', { url: demoUrl }, 'ProjectPreviewViewer');
                setShowIframe(false);
              }
            } catch (e) {
              // Error de acceso = probablemente CORS o X-Frame-Options
              logger.warn('Iframe blocked by security policy, showing fallback', { url: demoUrl, error: e }, 'ProjectPreviewViewer');
              setShowIframe(false);
            }
          }
        }, 5000); // 5 segundos

        return () => clearTimeout(timeout);
      } else {
        logger.error('Invalid protocol for iframe', { protocol: url.protocol, url: demoUrl }, 'ProjectPreviewViewer');
        setShowIframe(false);
      }
    } catch (error) {
      logger.error('Invalid URL for iframe', { url: demoUrl, error }, 'ProjectPreviewViewer');
      setShowIframe(false);
    }
  }, [demoUrl, viewMode, lowPerformanceMode]);

  return (
    <div className="flex-1 flex flex-col" style={{ gap: fluidSizing.space.md }}>
      {/* Botón de volver a demo */}
      <AnimatePresence>
        {viewMode === 'image' && demoUrl && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToDemo}
              className="border-white text-white hover:bg-white hover:text-black"
            >
              <svg style={{ width: fluidSizing.size.iconSm, height: fluidSizing.size.iconSm, marginRight: fluidSizing.space.sm }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('projects.backToPreview') || 'Volver a Vista Previa'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor de vista */}
      <div className="flex-1 bg-background-elevated rounded-lg overflow-hidden border border-white/10 relative">
        <AnimatePresence mode="wait">
          {viewMode === 'demo' && showIframe ? (
            <motion.div
              key="demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {/* Desktop/Tablet View */}
              <div className="hidden sm:block w-full h-full relative">
                {!showIframe && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background-elevated z-20">
                    <div className="text-center">
                      <svg 
                        className="mx-auto opacity-50" 
                        style={{ 
                          width: fluidSizing.size.hexButton, 
                          height: fluidSizing.size.hexButton,
                          marginBottom: fluidSizing.space.md,
                        }} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm }}>
                        {t('projects.previewNotAvailable') || 'Vista previa no disponible'}
                      </p>
                      <p className="text-text-muted mt-2" style={{ fontSize: fluidSizing.text.xs }}>
                        La página no permite ser mostrada en un iframe
                      </p>
                    </div>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src={demoUrl}
                  className="w-full h-full"
                  title={title}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  onError={() => {
                    logger.error('Iframe failed to load', { url: demoUrl }, 'ProjectPreviewViewer');
                    setShowIframe(false);
                  }}
                />
              </div>
              
              {/* Mobile View - Simulated Phone */}
              <div className="sm:hidden flex justify-center items-center h-full p-4">
                <div className="relative bg-background-dark rounded-[2.5rem] p-3 border-4 border-white/20 shadow-2xl" style={{ width: '320px', height: '640px' }}>
                  {/* Phone notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background-dark rounded-b-2xl z-10 border-x-4 border-b-4 border-white/20" />
                  
                  {/* Screen */}
                  <div className="relative w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
                    {!showIframe && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background-elevated z-20">
                        <div className="text-center px-4">
                          <svg 
                            className="mx-auto opacity-50" 
                            style={{ 
                              width: '48px', 
                              height: '48px',
                              marginBottom: fluidSizing.space.sm,
                            }} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="text-text-muted text-xs">
                            {t('projects.previewNotAvailable') || 'Vista previa no disponible'}
                          </p>
                        </div>
                      </div>
                    )}
                    <iframe
                      ref={iframeRef}
                      src={demoUrl}
                      className="w-full h-full"
                      title={title}
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                      onError={() => {
                        logger.error('Iframe failed to load (mobile)', { url: demoUrl }, 'ProjectPreviewViewer');
                        setShowIframe(false);
                      }}
                    />
                  </div>
                  
                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </motion.div>
          ) : viewMode === 'image' && images && images[selectedImageIndex] && !imageError ? (
            <motion.div
              key={`image-${selectedImageIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              <Image
                src={images[selectedImageIndex]}
                alt={`${title} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 85vw"
                priority
                onError={() => setImageError(true)}
              />
              {/* Contador de imagen */}
              <div 
                className="absolute bg-black/70 backdrop-blur-sm text-white rounded-lg font-mono"
                style={{
                  bottom: fluidSizing.space.md,
                  right: fluidSizing.space.md,
                  padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
                  fontSize: fluidSizing.text.sm,
                }}
              >
                {selectedImageIndex + 1} / {images.length}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center text-text-muted"
            >
              <div className="text-center">
                <svg 
                  className="mx-auto opacity-50" 
                  style={{ 
                    width: fluidSizing.size.hexButton, 
                    height: fluidSizing.size.hexButton,
                    marginBottom: fluidSizing.space.md,
                  }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p style={{ fontSize: fluidSizing.text.sm }}>{t('projects.noPreview') || 'No hay vista previa disponible'}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
