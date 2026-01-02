'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { logger } from '@/lib/logger';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface ProjectDemoViewerProps {
  demoUrl?: string;
  title: string;
  lowPerformanceMode: boolean;
  hasGallery?: boolean;
  onViewGallery?: () => void;
}

export default function ProjectDemoViewer({
  demoUrl,
  title,
  lowPerformanceMode,
  hasGallery = false,
  onViewGallery,
}: ProjectDemoViewerProps) {
  const { t } = useLanguage();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Log cuando se intenta cargar el iframe
  useEffect(() => {
    if (demoUrl && !lowPerformanceMode) {
      logger.debug('Loading iframe', { url: demoUrl }, 'ProjectDemoViewer');
    }
  }, [demoUrl, lowPerformanceMode]);

  if (!demoUrl || lowPerformanceMode) {
    return (
      <motion.div
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p style={{ fontSize: fluidSizing.text.sm }}>
            {lowPerformanceMode 
              ? (t('projects.previewDisabledPerformance') || 'Vista previa deshabilitada en modo de bajo rendimiento')
              : (t('projects.noDemo') || 'No hay demo disponible')
            }
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col" style={{ gap: fluidSizing.space.md }}>
      {/* View Gallery Button */}
      {hasGallery && onViewGallery && (
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onViewGallery}
          className="flex items-center text-white/70 hover:text-white transition-colors font-mono self-end"
          style={{ gap: fluidSizing.space.sm, fontSize: fluidSizing.text.sm }}
        >
          {t('projects.viewGallery') || 'Ver galería del proyecto'}
          <svg style={{ width: fluidSizing.size.iconSm, height: fluidSizing.size.iconSm }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 w-full h-full"
      >
      {/* Desktop/Tablet View */}
      <div className="hidden sm:block w-full h-full bg-background-elevated rounded-lg overflow-hidden border border-white/10">
        <iframe
          ref={iframeRef}
          src={demoUrl}
          className="w-full h-full"
          title={title}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          loading="lazy"
        />
      </div>
      
      {/* Mobile View - Simulated Phone */}
      <div className="sm:hidden flex justify-center items-center h-full">
        <div className="relative bg-background-dark rounded-[2.5rem] border-2 border-white/20 shadow-2xl" style={{ width: '360px', height: '720px', padding: fluidSizing.space.sm }}>
          {/* Phone notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background-dark rounded-b-2xl z-10 border-x-2 border-b-2 border-white/20" />
          
          {/* Screen */}
          <div className="relative w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
            <iframe
              ref={iframeRef}
              src={demoUrl}
              className="w-full h-full"
              title={title}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              loading="lazy"
            />
          </div>
          
          {/* Home indicator */}
          <div className="absolute left-1/2 -translate-x-1/2 bg-white/30 rounded-full" style={{ bottom: fluidSizing.space.sm, width: '6rem', height: '0.25rem' }} />
        </div>
      </div>
      </motion.div>
    </div>
  );
}
