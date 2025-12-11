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

  // Filtrar proyectos relacionados (excluir el actual y tomar máximo 4)
  const relatedProjects = projects
    .filter(project => project.id !== currentProjectId)
    .slice(0, 4);

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
        className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ marginBottom: fluidSizing.space['2xl'] }}
      />

      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ marginBottom: fluidSizing.space.lg }}
      >
        <h2 className="font-orbitron font-bold text-white flex items-center" style={{ fontSize: fluidSizing.text['3xl'], marginBottom: fluidSizing.space.sm, gap: fluidSizing.space.sm }}>
          <div className="bg-white rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.lg }} />
          {t('projects.relatedProjects')}
        </h2>
        <p className="text-text-secondary" style={{ fontSize: fluidSizing.text.base, marginLeft: fluidSizing.space.lg }}>
          {t('projects.relatedProjectsDesc')}
        </p>
      </motion.div>

      {/* Grid de proyectos relacionados */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
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
          className="font-orbitron font-bold uppercase tracking-wider border-2 border-white bg-white text-black hover:bg-transparent hover:text-white transition-all duration-300 flex items-center"
          style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}`, fontSize: fluidSizing.text.sm, gap: fluidSizing.space.sm }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('projects.viewAllProjects')}
        </motion.button>
      </motion.div>
    </section>
  );
}
