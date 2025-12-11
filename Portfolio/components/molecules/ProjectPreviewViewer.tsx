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
  selectedImageIndex: number | null;
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
  const [imageError, setImageError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Log cuando se intenta cargar el iframe
  useEffect(() => {
    if (demoUrl && viewMode === 'demo' && !lowPerformanceMode) {
      logger.debug('Loading iframe', { url: demoUrl }, 'ProjectPreviewViewer');
    }
  }, [demoUrl, viewMode, lowPerformanceMode]);

  return (
    <div className="flex-1 flex flex-col h-full" style={{ gap: fluidSizing.space.md }}>
      {/* Botón minimalista de volver a demo */}
      <AnimatePresence>
        {viewMode === 'image' && demoUrl && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onClick={onBackToDemo}
            className="flex items-center text-white/70 hover:text-white transition-colors font-mono self-start"
            style={{ gap: fluidSizing.space.sm, fontSize: fluidSizing.text.sm }}
          >
            <svg style={{ width: fluidSizing.size.iconSm, height: fluidSizing.size.iconSm }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('projects.backToDemo')}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contenedor de vista */}
      <div className="flex-1 bg-background-elevated rounded-lg overflow-hidden border border-white/10 relative">
        <AnimatePresence mode="wait">
          {viewMode === 'demo' && demoUrl && !lowPerformanceMode ? (
            <motion.div
              key="demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {/* Desktop/Tablet View */}
              <div className="hidden sm:block w-full h-full">
                <iframe
                  ref={iframeRef}
                  src={demoUrl}
                  className="w-full h-full"
                  title={title}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              </div>
              
              {/* Mobile View - Simulated Phone */}
              <div className="sm:hidden flex justify-center items-center h-full" style={{ padding: fluidSizing.space.md }}>
                <div className="relative bg-background-dark rounded-[2.5rem] border-4 border-white/20 shadow-2xl" style={{ width: '320px', height: '640px', padding: fluidSizing.space.sm }}>
                  {/* Phone notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background-dark rounded-b-2xl z-10 border-x-4 border-b-4 border-white/20" />
                  
                  {/* Screen */}
                  <div className="relative w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
                    <iframe
                      ref={iframeRef}
                      src={demoUrl}
                      className="w-full h-full"
                      title={title}
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    />
                  </div>
                  
                  {/* Home indicator */}
                  <div className="absolute left-1/2 -translate-x-1/2 bg-white/30 rounded-full" style={{ bottom: fluidSizing.space.sm, width: '6rem', height: '0.25rem' }} />
                </div>
              </div>
            </motion.div>
          ) : viewMode === 'image' && images && selectedImageIndex !== null && images[selectedImageIndex] && !imageError ? (
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
