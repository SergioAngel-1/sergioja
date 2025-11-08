'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLogger } from '@/lib/hooks/useLogger';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { api } from '@/lib/api-client';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import PageLoader from '@/components/molecules/PageLoader';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import type { Project } from '../../../../shared/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const log = useLogger('ProjectDetailPage');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.getProjects();
        
        // Verificar que la respuesta tenga la estructura correcta
        if (!response || !response.data) {
          throw new Error('Invalid API response');
        }
        
        const data = response.data as any;
        const projects = data.projects || [];
        
        const foundProject = projects.find((p: Project) => p.slug === slug);
        
        if (foundProject) {
          setProject(foundProject);
          log.info('Project loaded', { slug });
        } else {
          setError('Project not found');
          log.error('Project not found', { slug });
        }
      } catch (err) {
        setError('Error loading project');
        log.error('Error fetching project', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug, log]);

  if (loading) {
    return (
      <div className="relative min-h-screen pl-0 md:pl-20">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <PageLoader variant="simple" isLoading={true} message={t('projects.loading') || 'Cargando proyecto...'} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="relative z-10 mx-auto w-full flex items-center justify-center min-h-screen" style={{ maxWidth: '1600px', padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}` }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-block p-8 bg-cyber-red/10 border border-cyber-red/30 rounded-lg">
              <svg className="w-16 h-16 text-cyber-red mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-cyber-red text-xl font-rajdhani mb-4">{error || 'Proyecto no encontrado'}</p>
              <Button onClick={() => router.push('/projects')} variant="blue">
                {t('projects.backToProjects') || 'Volver a Proyectos'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20">
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
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors font-rajdhani"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('projects.backToProjects') || 'Volver a Proyectos'}</span>
          </button>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-3xl">
                {project.description}
              </p>
            </div>
            {project.featured && (
              <div className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-orbitron font-bold rounded border border-white/50 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                FEATURED
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Badge variant="blue">{tech}</Badge>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <Button
                onClick={() => window.open(project.demoUrl, '_blank')}
                variant="blue"
              >
                {t('projects.viewDemo') || 'Ver Demo'}
              </Button>
            )}
            {project.repoUrl && (
              <Button
                onClick={() => window.open(project.repoUrl, '_blank')}
                variant="outline"
              >
                {t('projects.viewCode') || 'Ver Código'}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Project Metrics */}
        {project.metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-12"
          >
            {[
              { label: 'Performance', value: project.metrics.performance },
              { label: 'Accessibility', value: project.metrics.accessibility },
              { label: 'SEO', value: project.metrics.seo },
            ].map((metric) => (
              <div key={metric.label} className="bg-background-surface/50 border border-white/20 rounded-lg p-6 hover:border-white/40 transition-all">
                <div className="text-center">
                  <div className="font-orbitron text-4xl font-bold text-white mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm text-text-muted uppercase tracking-wider">
                    {metric.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Project Preview */}
        {project.demoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-background-surface/50 border border-white/20 rounded-lg overflow-hidden p-4"
          >
            <div className="aspect-video bg-background-elevated rounded-lg overflow-hidden">
              <iframe
                src={project.demoUrl}
                className="w-full h-full"
                title={project.title}
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
