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
  const { t, language } = useLanguage();
  const { lowPerformanceMode } = usePerformance();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'demo' | 'image'>('demo');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [initialLowModeSet, setInitialLowModeSet] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  
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

  // Auto-select first image in low performance mode if images are available
  useEffect(() => {
    if (lowPerformanceMode && project?.images && project.images.length > 0 && !initialLowModeSet) {
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

  // Trigger 404 page if project not found (solo cuando ya terminó la carga)
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
              
              {/* Vista previa - Full width */}
              <div className="flex-1" style={{ minHeight: '500px' }}>
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
            </motion.div>
          </div>
        </div>

        {/* Project Gallery - New Section */}
        {project.images && project.images.length > 0 && (
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

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" style={{ gap: fluidSizing.space.md }}>
              {project.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setViewMode('image');
                    log.interaction('view_project_image', `${project.slug}-${index}`);
                    
                    // Scroll to preview section
                    setTimeout(() => {
                      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImageIndex === index && viewMode === 'image'
                      ? 'border-white'
                      : 'border-white/20 hover:border-white/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.05 }}
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    loading={index === 0 ? undefined : "lazy"}
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                  <div 
                    className="absolute bg-black/70 backdrop-blur-sm text-white rounded font-mono"
                    style={{
                      bottom: fluidSizing.space.xs,
                      right: fluidSizing.space.xs,
                      padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                      fontSize: fluidSizing.text.xs,
                    }}
                  >
                    {index + 1}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white opacity-50" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
            <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white opacity-50" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
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
