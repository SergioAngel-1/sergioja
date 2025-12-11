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
import ProjectDetailSkeleton from '@/components/molecules/ProjectDetailSkeleton';
import ProjectHero from '@/components/organisms/ProjectHero';
import ProjectMetrics from '@/components/molecules/ProjectMetrics';
import ProjectInfo from '@/components/molecules/ProjectInfo';
import ProjectActions from '@/components/molecules/ProjectActions';
import RelatedProjects from '@/components/molecules/RelatedProjects';
import ProjectPreviewViewer from '@/components/molecules/ProjectPreviewViewer';
import ProjectImageGallery from '@/components/molecules/ProjectImageGallery';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { project, loading, error } = useProject(slug);
  const { projects } = useProjects({ limit: 4 });
  const log = useLogger('ProjectDetailPage');
  const { t } = useLanguage();
  const { lowPerformanceMode } = usePerformance();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'demo' | 'image'>('demo');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
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

  // Show skeleton while mounting or loading
  if (!mounted || loading) {
    return <ProjectDetailSkeleton />;
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
          style={{ marginBottom: fluidSizing.space.lg }}
        >
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center text-text-secondary hover:text-white transition-colors font-rajdhani"
            style={{ gap: fluidSizing.space.sm, fontSize: fluidSizing.text.sm }}
          >
            <svg style={{ width: fluidSizing.size.iconSm, height: fluidSizing.size.iconSm }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('projects.backToProjects') || 'Volver a Proyectos'}</span>
          </button>
        </motion.div>

        {/* Project Hero & Metrics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:items-stretch" style={{ gap: fluidSizing.space.lg, marginBottom: fluidSizing.space.lg }}>
          {/* Project Hero */}
          <div className="lg:col-span-2 flex h-full">
            <ProjectHero project={project} />
          </div>

          {/* Project Metrics */}
          <div className="lg:col-span-1 flex h-full">
            <ProjectMetrics metrics={{
              performance: project.performanceScore || 0,
              accessibility: project.accessibilityScore || 0,
              seo: project.seoScore || 0,
            }} />
          </div>
        </div>

        {/* Grid Layout: Info + Actions + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:items-stretch" style={{ gap: fluidSizing.space.lg }}>
          {/* Left Column: Project Info + Actions */}
          <div className="lg:col-span-1 flex flex-col h-full" style={{ gap: fluidSizing.space.lg }}>
            <ProjectInfo project={project} />
            <ProjectActions project={project} />
          </div>

          {/* Project Preview/Description */}
          <div className="lg:col-span-2 flex h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 w-full flex flex-col"
              style={{ padding: fluidSizing.space.lg }}
            >
              <h2 className="font-orbitron font-bold text-white flex items-center" style={{ fontSize: fluidSizing.text['2xl'], marginBottom: fluidSizing.space.md, gap: fluidSizing.space.sm }}>
                <div className="bg-white rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.lg }} />
                {t('projects.preview')}
              </h2>
              
              {/* Vista previa dividida: 75% viewer + 25% gallery (o 100% si no hay imágenes) */}
              <div className="flex-1 flex" style={{ minHeight: '500px', gap: fluidSizing.space.md }}>
                {/* Viewer - Ajusta su ancho según si hay imágenes o no */}
                <div className={`h-full ${project.images && project.images.length > 0 ? 'flex-[0.75]' : 'flex-1'}`}>
                  <ProjectPreviewViewer
                    demoUrl={project.demoUrl}
                    images={project.images}
                    title={project.title}
                    lowPerformanceMode={lowPerformanceMode}
                    viewMode={viewMode}
                    selectedImageIndex={selectedImageIndex}
                    onBackToDemo={() => {
                      setViewMode('demo');
                      setSelectedImageIndex(null);
                    }}
                  />
                </div>

                {/* Gallery (25%) - Solo se muestra si hay imágenes */}
                {project.images && project.images.length > 0 && (
                  <div className="flex-[0.25] flex flex-col overflow-visible" style={{ minWidth: '150px', maxWidth: '280px', gap: fluidSizing.space.md }}>
                    {/* Título de galería */}
                    <h3 className="font-orbitron font-bold text-white/90" style={{ fontSize: fluidSizing.text.sm }}>
                      {t('projects.gallery')}
                    </h3>
                    <ProjectImageGallery
                      images={project.images}
                      selectedImageIndex={selectedImageIndex}
                      onImageSelect={(index) => {
                        setSelectedImageIndex(index);
                        setViewMode('image');
                        log.interaction('view_project_image', `${project.slug}-${index}`);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Low Performance Mode Message */}
              {lowPerformanceMode && project.demoUrl && (
                <div className="relative aspect-video bg-background-elevated rounded-lg overflow-hidden border border-white/10" style={{ marginTop: fluidSizing.space.md }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center" style={{ padding: `0 ${fluidSizing.space.md}` }}>
                      <svg className="text-white mx-auto" style={{ width: fluidSizing.size.hexButton, height: fluidSizing.size.hexButton, marginBottom: fluidSizing.space.md }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-text-muted font-mono" style={{ fontSize: fluidSizing.text.sm }}>
                        {t('projects.previewDisabledPerformance') || 'Vista previa deshabilitada en modo de bajo rendimiento'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* No preview available */}
              {!project.demoUrl && (
                <div className="relative aspect-video bg-background-elevated rounded-lg overflow-hidden border border-white/10" style={{ marginTop: fluidSizing.space.md }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center" style={{ padding: `0 ${fluidSizing.space.md}` }}>
                      <svg className="text-white mx-auto" style={{ width: fluidSizing.size.hexButton, height: fluidSizing.size.hexButton, marginBottom: fluidSizing.space.md }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <p className="text-text-muted font-mono" style={{ fontSize: fluidSizing.text.sm }}>{t('projects.previewNotAvailable')}</p>
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
