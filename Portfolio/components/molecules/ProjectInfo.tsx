'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import type { Project } from '@/shared/types';

interface ProjectInfoProps {
  project: Project;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
  const { t } = useLanguage();
  
  const infoItems = [
    {
      label: t('projects.category'),
      value: project.categories?.join(', ').toUpperCase() || 'N/A',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    },
    {
      label: t('projects.status'),
      value: project.publishedAt ? t('projects.completed') : t('projects.planned'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  // Agregar fecha de publicación si existe
  if (project.publishedAt) {
    infoItems.push({
      label: t('projects.date'),
      value: new Date(project.publishedAt).getFullYear().toString(),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 flex-1 flex flex-col relative"
      style={{ padding: fluidSizing.space.lg }}
    >
      <h2 className="font-orbitron font-bold text-white flex items-center" style={{ fontSize: fluidSizing.text['2xl'], marginBottom: fluidSizing.space.md, gap: fluidSizing.space.sm }}>
        <div className="bg-white rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.lg }} />
        {t('projects.info')}
      </h2>

      <div className="flex-1 flex flex-col" style={{ gap: fluidSizing.space.sm }}>
        {infoItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex items-center justify-between bg-background-elevated/50 rounded-lg border border-white/10 hover:border-white/20 transition-all group"
            style={{ padding: fluidSizing.space.sm }}
          >
            <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
              <div className="text-white/60 group-hover:text-white transition-colors" style={{ width: fluidSizing.size.iconMd, height: fluidSizing.size.iconMd }}>
                {item.icon}
              </div>
              <span className="text-text-secondary font-mono uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs }}>
                {item.label}
              </span>
            </div>
            <span className="text-white font-rajdhani font-semibold" style={{ fontSize: fluidSizing.text.sm }}>
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white opacity-50" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
      <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white opacity-50" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
    </motion.div>
  );
}
