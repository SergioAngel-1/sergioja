'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface ProjectImageViewerProps {
  images: string[];
  selectedImageIndex: number | null;
  galleryType: 'desktop' | 'mobile';
  title: string;
  onNavigate?: (newIndex: number) => void;
}

export default function ProjectImageViewer({
  images,
  selectedImageIndex,
  galleryType,
  title,
  onNavigate,
}: ProjectImageViewerProps) {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  // Navigation handlers
  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0 && onNavigate) {
      onNavigate(selectedImageIndex - 1);
      setImageError(false);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1 && onNavigate) {
      onNavigate(selectedImageIndex + 1);
      setImageError(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, images.length]);

  if (!images || images.length === 0 || selectedImageIndex === null || !images[selectedImageIndex]) {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p style={{ fontSize: fluidSizing.text.sm }}>
            {t('projects.noPreview') || 'No hay vista previa disponible'}
          </p>
        </div>
      </motion.div>
    );
  }

  if (imageError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ fontSize: fluidSizing.text.sm }}>
            {t('projects.imageError') || 'Error al cargar la imagen'}
          </p>
        </div>
      </motion.div>
    );
  }

  const hasPrevious = selectedImageIndex !== null && selectedImageIndex > 0;
  const hasNext = selectedImageIndex !== null && selectedImageIndex < images.length - 1;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-background-elevated/50 rounded-lg">
      {/* Previous Arrow */}
      <AnimatePresence>
        {hasPrevious && onNavigate && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={goToPrevious}
            className="absolute left-4 z-10 bg-black/70 backdrop-blur-sm text-white rounded-full p-3 hover:bg-black/90 transition-all duration-200 hover:scale-110"
            style={{ width: '48px', height: '48px' }}
            aria-label="Previous image"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Image Container */}
      <motion.div
        key={`image-${selectedImageIndex}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full flex items-center justify-center"
      >
        <div className={`relative ${
          galleryType === 'mobile' 
            ? 'h-full aspect-[9/16]' 
            : 'w-full aspect-video'
        }`}>
          <Image
            src={images[selectedImageIndex]}
            alt={`${title} - Image ${selectedImageIndex + 1}`}
            fill
            className="object-contain rounded-lg"
            sizes={galleryType === 'mobile' ? '(max-width: 768px) 90vw, 50vw' : '(max-width: 768px) 100vw, 85vw'}
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
        </div>
      </motion.div>

      {/* Next Arrow */}
      <AnimatePresence>
        {hasNext && onNavigate && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={goToNext}
            className="absolute right-4 z-10 bg-black/70 backdrop-blur-sm text-white rounded-full p-3 hover:bg-black/90 transition-all duration-200 hover:scale-110"
            style={{ width: '48px', height: '48px' }}
            aria-label="Next image"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
