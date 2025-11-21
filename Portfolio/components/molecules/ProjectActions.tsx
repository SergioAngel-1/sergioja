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
      className="bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300"
      style={{ padding: fluidSizing.space.lg }}
    >
      {/* Title */}
      <h2 className="font-orbitron text-base sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <div className="w-0.5 sm:w-1 h-4 sm:h-6 bg-white rounded-full" />
        {t('projects.actions')}
      </h2>

      {/* Action Buttons */}
      <div className="flex flex-col" style={{ gap: fluidSizing.space.md }}>
        {project.demoUrl && (
          <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white hover:text-black">
              {project.status === 'completed' ? t('projects.viewPage') : t('projects.viewDemo')}
            </Button>
          </Link>
        )}
        
        {project.repoUrl && (
          project.isCodePublic !== false ? (
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
          )
        )}
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white opacity-50" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white opacity-50" />
    </motion.div>
  );
}
