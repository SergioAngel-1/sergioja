'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { TechIcon } from '@/lib/utils/techIcons';
import { sanitizeSvg } from '@/lib/utils/sanitizeSvg';
import Tooltip from '@/components/atoms/Tooltip';
import type { Project } from '@/shared/types';

interface ProjectInfoProps {
  project: Project;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
  const { t } = useLanguage();
  
  // Obtener label de categoría desde el backend o usar el ID como fallback
  const getCategoryDisplayName = (category: string) => {
    return project.categoryLabels?.[category] || category.replace(/_/g, ' ');
  };
  
  const infoItems: { label: string; value: ReactNode; icon: ReactNode }[] = [
    {
      label: t('projects.category'),
      value: (
        <div className="flex items-center justify-end flex-wrap" style={{ gap: fluidSizing.space.xs }}>
          {project.categories && project.categories.length > 0 ? (
            project.categories.slice(0, 4).map((category, index) => {
              const displayName = getCategoryDisplayName(category);
              return (
                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors">
                  {displayName}
                </span>
              );
            })
          ) : (
            <span className="text-white/60">N/A</span>
          )}
          {project.categories && project.categories.length > 4 && (
            <Tooltip 
              content={
                <div className="flex flex-col gap-1">
                  {project.categories.slice(4).map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-white/60">•</span>
                      <span>{getCategoryDisplayName(c)}</span>
                    </div>
                  ))}
                </div>
              } 
              position="top" 
              maxWidth="300px"
            >
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 border border-white/20 text-white cursor-help hover:bg-white/20 transition-colors">
                +{project.categories.length - 4}
              </span>
            </Tooltip>
          )}
        </div>
      ),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    },
    {
      label: t('projects.status'),
      value:
        project.status === 'PUBLISHED'
          ? t('projects.completed')
          : project.status === 'IN_PROGRESS'
            ? t('projects.inProgress')
            : t('projects.planned'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  if (project.technologies?.length) {
    const maxVisibleTechIcons = 9;
    const visibleTechs = project.technologies.slice(0, maxVisibleTechIcons);
    const extraTechCount = Math.max(0, project.technologies.length - maxVisibleTechIcons);

    infoItems.push({
      label: 'TECH',
      value: (
        <div className="flex items-center justify-end flex-wrap" style={{ gap: fluidSizing.space.xs }}>
          {visibleTechs.map((tech) => (
            <Tooltip key={tech.name} content={tech.name} position="top">
              <span className="text-white/80 inline-flex cursor-help">
                {tech.icon ? (
                  <span
                    className="inline-flex w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                    dangerouslySetInnerHTML={{ __html: sanitizeSvg(tech.icon) }}
                  />
                ) : (
                  <TechIcon tech={tech.name} className="w-4 h-4" />
                )}
              </span>
            </Tooltip>
          ))}
          {extraTechCount > 0 && (
            <Tooltip 
              content={
                <div className="flex flex-col gap-1">
                  {project.technologies.slice(maxVisibleTechIcons).map((tech, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-white/60">•</span>
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              } 
              position="top"
              maxWidth="300px"
            >
              <span className="text-white/80 inline-flex items-center justify-center w-4 h-4 rounded-full border border-white/30 text-[10px] font-mono cursor-help">
                +
              </span>
            </Tooltip>
          )}
        </div>
      ),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-1.042-2.495l1.35-2.025a2 2 0 00-.245-2.552l-1.414-1.414a2 2 0 00-2.552-.245l-2.025 1.35a6 6 0 00-2.495-1.042l-.477-2.387A2 2 0 006.572 3H5a2 2 0 00-2 2v1.572a2 2 0 001.547 1.956l2.387.477a6 6 0 001.042 2.495l-1.35 2.025a2 2 0 00.245 2.552l1.414 1.414a2 2 0 002.552.245l2.025-1.35a6 6 0 002.495 1.042l.477 2.387A2 2 0 0017.428 21H19a2 2 0 002-2v-1.572a2 2 0 00-1.572-1.956z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 110-6 3 3 0 010 6z" />
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
