'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/lib/types';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function ProjectsContent() {
  const { t, language } = useLanguage();

  // Tarjetas fijas: Portfolio y Blog
  const isDev = typeof window !== 'undefined' && process.env.NODE_ENV === 'development';
  const portfolioProject: Project = {
    id: 'portfolio-static',
    title: t('nav.portfolio'),
    slug: 'portfolio',
    description: t('nav.portfolioDesc'),
    longDescription: undefined,
    image: undefined,
    images: undefined,
    technologies: ['Next.js', 'React', 'Three.js', 'Framer Motion', 'TailwindCSS', 'TypeScript'],
    tech: ['Next.js', 'React', 'Three.js', 'Framer Motion', 'TailwindCSS', 'TypeScript'],
    category: 'personal',
    featured: true,
    demoUrl: isDev ? 'http://localhost:3000' : 'https://portfolio.sergioja.com',
    githubUrl: undefined,
    repoUrl: undefined,
    status: 'completed',
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: undefined,
    metrics: undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const blogProject: Project = {
    id: 'blog-static',
    title: 'Blog',
    slug: 'blog',
    description: language === 'es' ? 'Notas, ideas y bitácora de proceso' : 'Notes, ideas, and build log',
    longDescription: undefined,
    image: undefined,
    images: undefined,
    technologies: [],
    tech: [],
    category: 'personal',
    featured: true,
    demoUrl: isDev ? 'http://localhost:3000/blog' : 'https://portfolio.sergioja.com/blog',
    githubUrl: undefined,
    repoUrl: undefined,
    status: 'completed',
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: undefined,
    metrics: undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };
  const cards: Project[] = [portfolioProject, blogProject];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
      {/* Propósito */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}
      >
        <h3 className="text-white font-bold text-fluid-lg">{t('purpose.title')}</h3>
        <div className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
      </motion.div>

      {/* Texto: propósito */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}>
        <p className="text-white/70 leading-relaxed text-fluid-sm">{t('purpose.paragraph1')}</p>
        <p className="text-white/70 leading-relaxed text-fluid-sm">{t('purpose.paragraph2')}</p>
      </div>

      {/* Tarjetas: Portfolio y Blog (estilo conexiones) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
        {cards.map((project, index) => (
          <motion.a
            key={project.id}
            href={project.demoUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-center rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            style={{ gap: fluidSizing.space.md, padding: fluidSizing.space.md }}
          >
            {/* Icono */}
            <div className="rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors text-white" style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}>
              {project.id === 'portfolio-static' ? (
                <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-9 4h6" />
                </svg>
              ) : (
                <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h10M7 15h6M5 5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9l-6-4H5z" />
                </svg>
              )}
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-fluid-sm">{project.title}</h4>
              <p className="text-white/60 truncate text-fluid-sm">{project.description}</p>
            </div>

            {/* Flecha */}
            <div className="text-white/40 group-hover:text-white/60 transition-colors">
              <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
