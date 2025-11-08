'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import Badge from '../atoms/Badge';
import PageLoader from './PageLoader';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import type { Project } from '../../../shared/types';

interface ProjectCardProps {
  project: Project;
  viewMode?: 'grid' | 'list';
}

// Caché global de iframes cargados
const iframeCache = new Map<string, boolean>();

export default function ProjectCard({ project, viewMode = 'grid' }: ProjectCardProps) {
  const isListView = viewMode === 'list';
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { lowPerformanceMode } = usePerformance();
  
  // Verificar si el iframe ya está en caché
  const isCached = useMemo(() => iframeCache.has(project.id), [project.id]);
  const [isIframeLoaded, setIsIframeLoaded] = useState(isCached);
  const [iframeError, setIframeError] = useState(false);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(isCached); // Si está en caché, cargar inmediatamente

  // Intersection Observer para lazy loading (solo si no está en modo bajo rendimiento)
  useEffect(() => {
    if (!project.demoUrl || iframeError || lowPerformanceMode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadIframe) {
            setShouldLoadIframe(true);
          }
        });
      },
      {
        rootMargin: '100px', // Cargar cuando esté a 100px de ser visible
        threshold: 0.1,
      }
    );

    const currentRef = iframeRef.current?.parentElement;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [project.demoUrl, iframeError, shouldLoadIframe, lowPerformanceMode]);

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
    // Guardar en caché que este iframe ya se cargó
    iframeCache.set(project.id, true);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIsIframeLoaded(false);
  };

  // Determinar si debe abrir en nueva pestaña (proyectos con solo demoUrl externa)
  const isExternalOnly = project.demoUrl && !project.repoUrl && project.demoUrl.startsWith('http');
  const cardContent = (
    <div className={`relative h-full bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-white hover:shadow-glow-white ${
      isListView ? 'flex flex-row' : 'flex flex-col'
    }`}>
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
      />

      {/* Featured badge - z-index alto para que se vea sobre todo */}
      {project.featured && (
        <motion.div
          className="absolute top-3 right-3 z-50 px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-[10px] font-orbitron font-bold rounded border border-white/50 flex items-center gap-1 shadow-lg shadow-white/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
        >
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          FEATURED
        </motion.div>
      )}

      {/* Interactive Preview section */}
      <div className={`relative bg-background-elevated overflow-hidden ${
        isListView ? 'w-64 flex-shrink-0' : 'w-full h-64'
      }`}>
        {/* Monitor frame */}
        <div className="absolute inset-0 bg-background-dark rounded-lg p-2">
          {/* Screen bezel */}
          <div className="relative h-full bg-background-surface rounded-md overflow-hidden border-2 border-white/30 group-hover:border-white/60 transition-colors">
            {/* Browser toolbar */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-background-elevated/80 backdrop-blur-sm flex items-center px-2 z-20 border-b border-white/20">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyber-red" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  {/* URL bar */}
                  <div className="ml-2 flex-1 h-3 bg-background-dark/50 rounded flex items-center px-2">
                    <span className="text-[8px] text-text-muted font-mono truncate">
                      {project.demoUrl || project.repoUrl}
                    </span>
                  </div>
                </div>

                {/* Content area with iframe */}
                <div className="absolute inset-0 top-6" ref={iframeRef}>
                  {project.demoUrl && !iframeError && !lowPerformanceMode ? (
                    <>
                      {/* Loading state con PageLoader - no mostrar si está en caché */}
                      {!isIframeLoaded && shouldLoadIframe && !isCached && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background-elevated z-10">
                          <PageLoader 
                            variant="simple" 
                            isLoading={true}
                            message="Cargando preview"
                          />
                        </div>
                      )}
                      {/* Live iframe - solo cargar cuando sea visible y NO renderizar si hay error */}
                      {shouldLoadIframe && !iframeError && (
                        <div className="w-full h-full overflow-hidden">
                          <iframe
                            src={project.demoUrl}
                            className={`w-[200%] h-[200%] origin-top-left transition-opacity duration-500 ${
                              isIframeLoaded || isCached ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                              transform: 'scale(0.5)',
                              transformOrigin: 'top left',
                            }}
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                            title={project.title}
                            loading="lazy"
                            sandbox="allow-same-origin allow-scripts allow-forms"
                          />
                        </div>
                      )}
                    </>
                  ) : null}
                  
                  {/* Fallback visual - mostrar si hay error, no hay demoUrl, o modo bajo rendimiento */}
                  {(!project.demoUrl || iframeError || lowPerformanceMode) && (
                    // Fallback visual
                    <div className="absolute inset-0">
                      {/* Gradient background - sin animación en modo bajo rendimiento */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-text-secondary/10 to-white/10" />
                      
                      {/* Grid pattern overlay */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="w-full h-full" style={{
                          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                          backgroundSize: '20px 20px'
                        }} />
                      </div>
                      
                      {/* Icon y mensaje */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <span className="text-6xl opacity-30">
                          {iframeError ? '⚠️' : '🚀'}
                        </span>
                        {iframeError && (
                          <div className="text-center px-4">
                            <p className="text-xs text-cyber-red font-mono mb-1">
                              Error al cargar preview
                            </p>
                            <p className="text-[10px] text-text-muted">
                              El sitio no está disponible
                            </p>
                          </div>
                        )}
                        {lowPerformanceMode && !iframeError && (
                          <div className="text-center px-4">
                            <p className="text-xs text-text-secondary font-mono mb-1">
                              Modo bajo rendimiento
                            </p>
                            <p className="text-[10px] text-text-muted">
                              Vista previa desactivada
                            </p>
                          </div>
                        )}
                        {!iframeError && !lowPerformanceMode && !project.demoUrl && (
                          <div className="text-center px-4">
                            <p className="text-xs text-text-muted font-mono">
                              Sin vista previa disponible
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Screen reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                {/* Scanline effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.02) 50%)',
                    backgroundSize: '100% 4px',
                  }}
                  animate={{ backgroundPositionY: ['0px', '4px'] }}
                  transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>

            {/* Category badge */}
            <div className="absolute bottom-3 left-3 z-20">
              <span className="px-3 py-1 bg-background-dark/90 backdrop-blur-sm text-white text-xs font-mono rounded-full border border-white/50">
                {project.category.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 flex flex-col p-6 relative z-10 ${
            isListView ? 'justify-center' : ''
          }`}>
            {/* Title */}
            <h3 className="font-orbitron text-2xl font-bold mb-3 text-white transition-all duration-300">
              {project.title}
            </h3>
            
            {/* Description */}
            <p className="text-text-secondary text-sm mb-4 leading-relaxed flex-1">
              {project.description}
            </p>

            {/* Metrics - Highlighted */}
            {project.metrics && (
              <div className="flex gap-2 mb-4">
                {[
                  { label: 'Performance', value: project.metrics.performance },
                  { label: 'Accessibility', value: project.metrics.accessibility },
                  { label: 'SEO', value: project.metrics.seo },
                ].map((metric) => (
                  <div key={metric.label} className="relative group/metric flex-1">
                    <div className="bg-background-elevated border border-white/20 rounded-lg p-2 group-hover:border-white/40 transition-all duration-300">
                      <div className="flex items-center justify-center">
                        <span className="font-orbitron text-2xl font-bold text-white group-hover:text-white transition-colors duration-300">
                          {metric.value}
                        </span>
                      </div>
                      <div className="text-[9px] text-text-muted uppercase tracking-wider text-center mt-1">
                        {metric.label}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg blur-lg transition-opacity pointer-events-none" />
                  </div>
                ))}
              </div>
            )}

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.slice(0, isListView ? 5 : 3).map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge variant="blue">
                    {tech}
                  </Badge>
                </motion.div>
              ))}
              {project.tech.length > (isListView ? 5 : 3) && (
                <Badge variant="default">
                  +{project.tech.length - (isListView ? 5 : 3)}
                </Badge>
              )}
            </div>

            {/* Action indicator */}
            <div className="flex items-center gap-2 text-white text-sm font-rajdhani font-semibold group-hover:gap-3 transition-all">
              <span>View Project</span>
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white opacity-50 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group h-full"
    >
      {isExternalOnly ? (
        <a 
          href={project.demoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block h-full"
        >
          {cardContent}
        </a>
      ) : (
        <Link href={`/work/${project.slug}`}>
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}
