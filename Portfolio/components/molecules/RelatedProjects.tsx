'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ProjectCard from './ProjectCard';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import type { Project } from '@/shared/types';

interface RelatedProjectsProps {
  projects: Project[];
  currentProjectId: string;
}

export default function RelatedProjects({ projects, currentProjectId }: RelatedProjectsProps) {
  const { t } = useLanguage();
  const router = useRouter();

  // Filtrar proyectos relacionados (excluir el actual y tomar máximo 3)
  const relatedProjects = projects
    .filter(project => project.id !== currentProjectId)
    .slice(0, 3);

  if (relatedProjects.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      {/* Separador */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-12"
      />

      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="font-orbitron text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-1 h-6 sm:h-8 bg-white rounded-full" />
          {t('projects.relatedProjects')}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base ml-7">
          {t('projects.relatedProjectsDesc')}
        </p>
      </motion.div>

      {/* Grid de proyectos relacionados */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: fluidSizing.space.lg }}
      >
        {relatedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      {/* Botón Ver más proyectos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex justify-center"
        style={{ marginTop: fluidSizing.space.xl }}
      >
        <motion.button
          onClick={() => router.push('/projects')}
          className="group relative px-8 py-4 bg-background-surface/50 backdrop-blur-sm border border-white/30 hover:border-white rounded-lg text-white font-rajdhani font-semibold text-sm sm:text-base transition-all duration-300 flex items-center gap-3 overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Background animation */}
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Icon */}
          <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          
          {/* Text */}
          <span className="relative z-10">{t('projects.viewAllProjects')}</span>
          
          {/* Arrow */}
          <motion.svg
            className="w-5 h-5 relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white opacity-50 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </motion.div>
    </section>
  );
}
