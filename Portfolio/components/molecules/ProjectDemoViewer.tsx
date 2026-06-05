'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { logger } from '@/lib/logger';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { cache, CacheTTL } from '@/lib/cache';

const DESKTOP_IFRAME_WIDTH = 1440;
const MOBILE_IFRAME_WIDTH = 390; // iPhone 14 logical viewport

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
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileScreenRef = useRef<HTMLDivElement>(null);
  const isSmUp = useMediaQuery('(min-width: 640px)');

  // Default scale=1 so iframe renders immediately; ResizeObserver corrects it on mount
  const [iframeScale, setIframeScale] = useState({ scale: 1, height: 900 });
  const [mobileScale, setMobileScale] = useState({ scale: 1, height: 720 });

  const handleIframeFailure = useCallback(() => {
    if (hasGallery && onViewGallery) {
      onViewGallery();
    }
  }, [hasGallery, onViewGallery]);

  // Preflight: check X-Frame-Options/CSP in parallel — iframe renders immediately,
  // but if blocked we switch to gallery before the browser shows the error page.
  // Result is cached 30min so revisiting the same project skips the network round-trip.
  // Skipped in development (localhost) since frame-ancestors never includes localhost.
  useEffect(() => {
    if (!demoUrl || lowPerformanceMode || !hasGallery || !onViewGallery) return;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;

    const from = encodeURIComponent(window.location.origin);
    const cacheKey = `embed-check:${demoUrl}`;

    cache.fetchWithCache<{ embeddable: boolean }>(
      cacheKey,
      () => fetch(`/api/check-embed?url=${encodeURIComponent(demoUrl)}&from=${from}`)
            .then(r => r.json()),
      CacheTTL.THIRTY_MINUTES,
    )
      .then(({ embeddable }) => { if (!embeddable) onViewGallery(); })
      .catch(() => {});
  }, [demoUrl, lowPerformanceMode, hasGallery, onViewGallery]);

  // Desktop scale: measure motion.div container
  useEffect(() => {
    if (!isSmUp) return;
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width) return;
      const scale = rect.width / DESKTOP_IFRAME_WIDTH;
      const h = rect.height > 10 ? rect.height : rect.width * 0.5625;
      setIframeScale({ scale, height: h / scale });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isSmUp]);

  // Mobile scale: measure the phone screen div
  useEffect(() => {
    if (isSmUp) return;
    const el = mobileScreenRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width) return;
      const scale = rect.width / MOBILE_IFRAME_WIDTH;
      const h = rect.height > 0 ? rect.height : rect.width * 2;
      setMobileScale({ scale, height: h / scale });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isSmUp]);

  // Log cuando se intenta cargar el iframe
  useEffect(() => {
    if (demoUrl && !lowPerformanceMode) {
      logger.debug('Loading iframe', { url: demoUrl }, 'ProjectDemoViewer');
    }
  }, [demoUrl, lowPerformanceMode]);

  // Prevent iframe focus-steal from scrolling the parent page
  useEffect(() => {
    if (!demoUrl || lowPerformanceMode) return;
    let prevScrollY = 0;
    let lastScrollY = window.scrollY;
    const onScroll = () => { prevScrollY = lastScrollY; lastScrollY = window.scrollY; };
    const onBlur = () => {
      const saved = prevScrollY;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (Math.abs(window.scrollY - saved) > 200) window.scrollTo(0, saved);
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('blur', onBlur);
    };
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
            style={{ width: fluidSizing.size.hexButton, height: fluidSizing.size.hexButton, marginBottom: fluidSizing.space.md }}
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
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 w-full h-full"
      >
        {isSmUp ? (
          /* Desktop: renders at 1440px, scaled to container */
          <div className="w-full h-full bg-background-elevated rounded-lg border border-white/10 overflow-hidden relative">
            <iframe
              ref={iframeRef}
              src={demoUrl}
              title={title}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              loading="eager"
              onError={handleIframeFailure}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${DESKTOP_IFRAME_WIDTH}px`,
                height: `${iframeScale.height}px`,
                transform: `scale(${iframeScale.scale})`,
                transformOrigin: 'top left',
                border: 'none',
              }}
            />
          </div>
        ) : (
          /* Mobile: simulated phone, renders at 390px, scaled to screen */
          <div className="flex justify-center items-center h-full">
            <div
              className="relative bg-background-dark rounded-[2.5rem] border-2 border-white/20 shadow-2xl"
              style={{ width: '360px', height: '720px', padding: fluidSizing.space.sm }}
            >
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background-dark rounded-b-2xl z-10 border-x-2 border-b-2 border-white/20" />
              {/* Screen */}
              <div ref={mobileScreenRef} className="relative w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src={demoUrl}
                  title={title}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  loading="eager"
                  onError={handleIframeFailure}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${MOBILE_IFRAME_WIDTH}px`,
                    height: `${mobileScale.height}px`,
                    transform: `scale(${mobileScale.scale})`,
                    transformOrigin: 'top left',
                    border: 'none',
                  }}
                />
              </div>
              {/* Home indicator */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bg-white/30 rounded-full"
                style={{ bottom: fluidSizing.space.sm, width: '6rem', height: '0.25rem' }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
