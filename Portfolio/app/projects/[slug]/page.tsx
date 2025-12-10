'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProject, useProjects } from '@/lib/hooks/useProjects';
import { useLogger } from '@/shared/hooks/useLogger';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import PageLoader from '@/components/molecules/PageLoader';
import ProjectHero from '@/components/organisms/ProjectHero';
import ProjectMetrics from '@/components/molecules/ProjectMetrics';
import ProjectInfo from '@/components/molecules/ProjectInfo';
import ProjectActions from '@/components/molecules/ProjectActions';
import RelatedProjects from '@/components/molecules/RelatedProjects';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { project, loading, error } = useProject(slug);
  const { projects } = useProjects();
  const log = useLogger('ProjectDetailPage');
  const { t } = useLanguage();
  const { lowPerformanceMode } = usePerformance();
  const [mounted, setMounted] = useState(false);
  
  // Track scroll depth and time on page
  usePageAnalytics();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (project) {
      log.info('Project loaded', { slug: project.slug });
    }
  }, [project, log]);

  // Show loader while mounting or loading
  if (!mounted || loading) {
    return (
      <div className="relative min-h-screen pl-0 md:pl-20 with-bottom-nav-inset">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="flex items-center justify-center min-h-screen">
          <PageLoader variant="simple" isLoading={true} message={t('projects.loading') || 'Cargando proyecto...'} />
        </div>
      </div>
    );
  }

  // Trigger 404 page if project not found
  if (error || !project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20 with-bottom-nav-inset">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-10" />

      {/* Animated glow effects */}
      <GlowEffect
        color="white"
        size="lg"
        position={{ top: '5rem', right: '5rem' }}
        opacity={0.15}
        duration={3}
        animationType="pulse"
      />

      <GlowEffect
        color="white"
        size="lg"
        position={{ bottom: '5rem', left: '10rem' }}
        opacity={0.1}
        duration={4}
        delay={0.5}
        animationType="pulse"
      />

      {/* Floating particles */}
      <FloatingParticles count={50} color="bg-white" />

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: '1600px', padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}`, paddingTop: `calc(${fluidSizing.header.height} + ${fluidSizing.space.md})` }}>
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors font-rajdhani text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('projects.backToProjects') || 'Volver a Proyectos'}</span>
          </button>
        </motion.div>

        {/* Project Hero & Metrics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:items-stretch gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Project Hero */}
          <div className="lg:col-span-2 flex">
            <ProjectHero project={project} />
          </div>

          {/* Project Metrics */}
          <div className="lg:col-span-1 flex">
            <ProjectMetrics metrics={{
              performance: project.performanceScore || 0,
              accessibility: project.accessibilityScore || 0,
              seo: project.seoScore || 0,
            }} />
          </div>
        </div>

        {/* Grid Layout: Info + Actions + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:items-stretch gap-6 sm:gap-8">
          {/* Left Column: Project Info + Actions */}
          <div className="lg:col-span-1 flex flex-col gap-6 sm:gap-8">
            <ProjectInfo project={project} />
            <ProjectActions project={project} />
          </div>

          {/* Project Preview/Description */}
          <div className="lg:col-span-2 flex">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg p-4 sm:p-6 md:p-8 hover:border-white/40 transition-all duration-300 w-full flex flex-col"
            >
              <h2 className="font-orbitron text-base sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-0.5 sm:w-1 h-4 sm:h-6 bg-white rounded-full" />
                {t('projects.preview')}
              </h2>
              
              {/* Preview iframe - only if URL exists and not in low performance mode */}
              {project.demoUrl && !lowPerformanceMode && (
                <>
                  {/* Desktop/Tablet View */}
                  <div className="hidden sm:block flex-1 bg-background-elevated rounded-lg overflow-hidden border border-white/10">
                    <iframe
                      src={project.demoUrl}
                      className="w-full h-full"
                      title={project.title}
                      loading="lazy"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    />
                  </div>
                  
                  {/* Mobile View - Simulated Phone */}
                  <div className="sm:hidden flex justify-center">
                    <div className="relative bg-background-dark rounded-[2.5rem] p-3 border-4 border-white/20 shadow-2xl" style={{ width: '320px', height: '640px' }}>
                      {/* Phone notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background-dark rounded-b-2xl z-10 border-x-4 border-b-4 border-white/20" />
                      
                      {/* Screen */}
                      <div className="relative w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
                        <iframe
                          src={project.demoUrl}
                          className="w-full h-full"
                          title={project.title}
                          loading="lazy"
                          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                        />
                      </div>
                      
                      {/* Home indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
                    </div>
                  </div>
                </>
              )}

              {/* Low Performance Mode Message */}
              {lowPerformanceMode && project.demoUrl && (
                <div className="relative aspect-video bg-background-elevated rounded-lg overflow-hidden border border-white/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                      <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-text-muted font-mono text-xs sm:text-sm">
                        {t('projects.previewDisabledPerformance') || 'Vista previa deshabilitada en modo de bajo rendimiento'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* No preview available */}
              {!project.demoUrl && (
                <div className="relative aspect-video bg-background-elevated rounded-lg overflow-hidden border border-white/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                      <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <p className="text-text-muted font-mono text-xs sm:text-sm">{t('projects.previewNotAvailable')}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Related Projects */}
        <div style={{ marginTop: fluidSizing.space['2xl'] }}>
          <RelatedProjects projects={projects} currentProjectId={project.id} />
        </div>
      </div>
    </div>
  );
}
