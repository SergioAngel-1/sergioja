'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import type { Project } from '@/shared/types';

interface ProjectActionsProps {
  project: Project;
}

export default function ProjectActions({ project }: ProjectActionsProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 flex-1 flex flex-col relative"
      style={{ padding: fluidSizing.space.lg }}
    >
      {/* Title */}
      <h2 className="font-orbitron font-bold text-white flex items-center" style={{ fontSize: fluidSizing.text['2xl'], marginBottom: fluidSizing.space.md, gap: fluidSizing.space.sm }}>
        <div className="bg-white rounded-full" style={{ width: fluidSizing.space.xs, height: fluidSizing.space.lg }} />
        {t('projects.actions')}
      </h2>

      {/* Action Buttons */}
      <div className="flex flex-col" style={{ gap: fluidSizing.space.md }}>
        {project.demoUrl ? (
          <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white hover:text-black">
              {project.status === 'PUBLISHED' ? t('projects.viewPage') : t('projects.viewDemo')}
            </Button>
          </Link>
        ) : (
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full bg-white/10 text-white/40 border-white/20 cursor-not-allowed"
            disabled
          >
            {t('projects.localProject')}
          </Button>
        )}
        
        {project.isCodePublic !== false && project.repoUrl ? (
          <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="outline" size="lg" className="w-full bg-white text-black border-white hover:bg-transparent hover:text-white">
              {t('projects.viewCode')}
            </Button>
          </Link>
        ) : (
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full bg-white/10 text-white/40 border-white/20 cursor-not-allowed"
            disabled
          >
            {t('projects.privateCode')}
          </Button>
        )}
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white opacity-50" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
      <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white opacity-50" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
    </motion.div>
  );
}
