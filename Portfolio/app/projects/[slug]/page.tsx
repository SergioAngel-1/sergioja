'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useProject, useProjects } from '@/lib/hooks/useProjects';
import { useLogger } from '@/shared/hooks/useLogger';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import ProjectHero from '@/components/organisms/ProjectHero';
import ProjectMetrics from '@/components/molecules/ProjectMetrics';
import ProjectInfo from '@/components/molecules/ProjectInfo';
import ProjectActions from '@/components/molecules/ProjectActions';
import RelatedProjects from '@/components/molecules/RelatedProjects';
import ProjectDemoViewer from '@/components/molecules/ProjectDemoViewer';
import ProjectImageViewer from '@/components/molecules/ProjectImageViewer';
import ProjectImageGallery from '@/components/molecules/ProjectImageGallery';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';
import { useProjectView } from '@/shared/hooks/useProjectView';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { project, loading, error, redirectTo } = useProject(slug);
  const { projects } = useProjects({ limit: 4 });
  const log = useLogger('ProjectDetailPage');
  const { t, language } = useLanguage();
  const { lowPerformanceMode } = usePerformance();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'demo' | 'image'>('demo');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedGalleryType, setSelectedGalleryType] = useState<'desktop' | 'mobile'>('desktop');
  const [initialLowModeSet, setInitialLowModeSet] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Track scroll depth and time on page
  usePageAnalytics();
  
  // Track project view
  useProjectView(project?.id, project?.slug);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (project) {
      log.info('Project loaded', { slug: project.slug });
    }
  }, [project, log]);

  // Handle redirect if found
  useEffect(() => {
    if (redirectTo) {
      log.info('Redirecting to new slug', { from: slug, to: redirectTo });
      router.replace(`/projects/${redirectTo}`);
    }
  }, [redirectTo, slug, router, log]);

  // Auto-switch to gallery when demoUrl is empty but images are available
  useEffect(() => {
    if (project && !project.demoUrl) {
      const hasDesktop = project.imagesDesktop && project.imagesDesktop.length > 0;
      const hasMobile = project.imagesMobile && project.imagesMobile.length > 0;
      if (hasDesktop || hasMobile) {
        const galleryType = hasDesktop ? 'desktop' : 'mobile';
        setSelectedGalleryType(galleryType);
        setSelectedImageIndex(0);
        setViewMode('image');
      }
    }
  }, [project]);

  // Auto-select first image in low performance mode if images are available
  useEffect(() => {
    if (lowPerformanceMode && project?.imagesDesktop && project.imagesDesktop.length > 0 && !initialLowModeSet) {
      setSelectedImageIndex(0);
      setViewMode('image');
      setInitialLowModeSet(true);
    }
  }, [lowPerformanceMode, project, initialLowModeSet]);

  // Wait for mounting
  if (!mounted) {
    return null;
  }

  // Don't render while loading - PageLoader handles transition
  if (loading) {
    return null;
  }

  // If redirecting, show nothing (router.replace will handle navigation)
  if (redirectTo) {
    return null;
  }

  // Trigger 404 page if project not found and no redirect exists
  if (error || !project) {
    notFound();
  }

  const localizedLongDescription =
    language === 'en'
      ? project.longDescriptionEn || project.longDescriptionEs || ''
      : project.longDescriptionEs || project.longDescriptionEn || '';

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
          <div ref={previewRef} className="lg:col-span-2 flex h-full">
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
              
              {/* Back to demo button and tabs */}
              {viewMode === 'image' && (
                <div className="flex items-center justify-between mb-4">
                  {/* Back to demo button */}
                  {project.demoUrl && (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        setViewMode('demo');
                        setSelectedImageIndex(null);
                      }}
                      className="flex items-center text-white/70 hover:text-white transition-colors font-mono"
                      style={{ gap: fluidSizing.space.sm, fontSize: fluidSizing.text.sm }}
                    >
                      <svg style={{ width: fluidSizing.size.iconSm, height: fluidSizing.size.iconSm }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      {t('projects.backToDemo')}
                    </motion.button>
                  )}

                  {/* Desktop/Mobile Tabs */}
                  {((project.imagesDesktop && project.imagesDesktop.length > 0) && (project.imagesMobile && project.imagesMobile.length > 0)) && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex bg-background-elevated/50 backdrop-blur-sm border border-white/20 rounded-lg p-1"
                    >
                      <button
                        onClick={() => {
                          const newImages = project.imagesDesktop;
                          if (newImages && newImages.length > 0) {
                            setSelectedGalleryType('desktop');
                            setSelectedImageIndex(0);
                            log.interaction('switch_gallery_type', `${project.slug}-desktop`);
                          }
                        }}
                        className={`px-4 py-2 rounded-md font-mono text-sm transition-all duration-200 ${
                          selectedGalleryType === 'desktop'
                            ? 'bg-white text-background-dark shadow-lg'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                        style={{ fontSize: fluidSizing.text.sm }}
                      >
                        Desktop
                      </button>
                      <button
                        onClick={() => {
                          const newImages = project.imagesMobile;
                          if (newImages && newImages.length > 0) {
                            setSelectedGalleryType('mobile');
                            setSelectedImageIndex(0);
                            log.interaction('switch_gallery_type', `${project.slug}-mobile`);
                          }
                        }}
                        className={`px-4 py-2 rounded-md font-mono text-sm transition-all duration-200 ${
                          selectedGalleryType === 'mobile'
                            ? 'bg-white text-background-dark shadow-lg'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                        style={{ fontSize: fluidSizing.text.sm }}
                      >
                        Mobile
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Vista previa - Full width */}
              <div className="flex-1" style={{ minHeight: '500px' }}>
                {viewMode === 'demo' ? (
                  <ProjectDemoViewer
                    demoUrl={project.demoUrl}
                    title={project.title}
                    lowPerformanceMode={lowPerformanceMode}
                    hasGallery={((project.imagesDesktop && project.imagesDesktop.length > 0) || (project.imagesMobile && project.imagesMobile.length > 0))}
                    onViewGallery={() => {
                      const firstGalleryType = (project.imagesDesktop && project.imagesDesktop.length > 0) ? 'desktop' : 'mobile';
                      const firstImages = firstGalleryType === 'desktop' ? project.imagesDesktop : project.imagesMobile;
                      if (firstImages && firstImages.length > 0) {
                        setSelectedGalleryType(firstGalleryType);
                        setSelectedImageIndex(0);
                        setViewMode('image');
                        log.interaction('view_gallery_from_demo', `${project.slug}-${firstGalleryType}`);
                      }
                    }}
                  />
                ) : (
                  <ProjectImageViewer
                    images={selectedGalleryType === 'mobile' ? (project.imagesMobile || []) : (project.imagesDesktop || [])}
                    selectedImageIndex={selectedImageIndex}
                    galleryType={selectedGalleryType}
                    title={project.title}
                    onNavigate={(newIndex) => {
                      setSelectedImageIndex(newIndex);
                      log.interaction('navigate_project_image', `${project.slug}-${selectedGalleryType}-${newIndex}`);
                    }}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Project Gallery - New Section */}
        {((project.imagesDesktop && project.imagesDesktop.length > 0) || (project.imagesMobile && project.imagesMobile.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300"
            style={{ marginTop: fluidSizing.space.lg, padding: fluidSizing.space.lg }}
          >
            {/* Gallery Title */}
            <h2 className="font-orbitron font-bold text-white flex items-center" style={{ fontSize: fluidSizing.text['2xl'], marginBottom: fluidSizing.space.md, gap: fluidSizing.space.sm }}>
              <div className="bg-white rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.lg }} />
              {t('projects.galleryTitle') || 'Galería del Proyecto'}
            </h2>

            {/* Gallery Component */}
            <ProjectImageGallery
              desktopImages={project.imagesDesktop || []}
              mobileImages={project.imagesMobile || []}
              selectedImageIndex={selectedImageIndex}
              selectedGalleryType={selectedGalleryType}
              onImageSelect={(index: number, galleryType: 'desktop' | 'mobile') => {
                setSelectedImageIndex(index);
                setSelectedGalleryType(galleryType);
                setViewMode('image');
                log.interaction('view_project_image', `${project.slug}-${galleryType}-${index}`);
                
                // Scroll to preview section
                setTimeout(() => {
                  previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              projectTitle={project.title}
            />
          </motion.div>
        )}

        {/* Related Projects */}
        <div style={{ marginTop: fluidSizing.space['2xl'] }}>
          <RelatedProjects projects={projects} currentProjectId={project.id} />
        </div>
      </div>
    </div>
  );
}
