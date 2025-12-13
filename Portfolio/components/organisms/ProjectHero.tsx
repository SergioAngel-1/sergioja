'use client';

import { motion } from 'framer-motion';
import Badge from '../atoms/Badge';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import type { Project } from '@/shared/types';

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const { t, language } = useLanguage();

  const localizedLongDescription =
    language === 'en'
      ? project.longDescriptionEn || project.longDescriptionEs || ''
      : project.longDescriptionEs || project.longDescriptionEn || '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="relative group w-full h-full flex"
    >
      {/* Featured Badge */}
      {project.isFeatured && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute z-10 bg-white/10 backdrop-blur-sm text-white font-orbitron font-bold rounded border border-white/50 flex items-center"
          style={{ top: '-0.5rem', right: '-0.5rem', padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, gap: fluidSizing.space.xs, fontSize: fluidSizing.text.xs }}
        >
          <svg className="text-cyber-red" style={{ width: fluidSizing.size.iconSm, height: fluidSizing.size.iconSm }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          FEATURED
        </motion.div>
      )}

      {/* Hero Container */}
      <div className="relative h-full w-full bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300 flex flex-col" style={{ padding: fluidSizing.space.lg }}>
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 border-t-2 border-l-2 border-white" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
        <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-white" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
        
        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: fluidSizing.space.sm }}
        >
          <span className="bg-background-dark/90 backdrop-blur-sm text-white font-mono rounded-full border border-white/50 uppercase" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.xs }}>
            {project.categories?.[0] || 'PROJECT'}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-orbitron font-bold text-white"
          style={{ fontSize: fluidSizing.text['3xl'], marginBottom: fluidSizing.space.sm }}
        >
          {project.title}
        </motion.h1>

        {/* Description - Scrollable Container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex-1 overflow-y-auto custom-scrollbar-thin"
          style={{ maxHeight: '200px', marginBottom: fluidSizing.space.md }}
        >
          {localizedLongDescription && (
            <p className="text-text-secondary leading-relaxed whitespace-pre-line" style={{ fontSize: fluidSizing.text.base }}>
              {localizedLongDescription}
            </p>
          )}
        </motion.div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg pointer-events-none"
        />
      </div>
    </motion.div>
  );
}
