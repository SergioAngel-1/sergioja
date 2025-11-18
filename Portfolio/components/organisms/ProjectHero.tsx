'use client';

import { motion } from 'framer-motion';
import Badge from '../atoms/Badge';
import { TechIcon } from '@/lib/utils/techIcons';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import type { Project } from '../../../shared/types';

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const { t } = useLanguage();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Featured Badge */}
      {project.featured && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-2 -right-2 z-10 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-orbitron font-bold rounded border border-white/50 flex items-center gap-2 shadow-lg shadow-white/20"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          FEATURED
        </motion.div>
      )}

      {/* Hero Container */}
      <div className="relative bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300" style={{ padding: `${fluidSizing.space.lg} ${fluidSizing.space.xl}` }}>
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
        
        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <span className="px-3 py-1 bg-background-dark/90 backdrop-blur-sm text-white text-xs font-mono rounded-full border border-white/50 uppercase">
            {project.category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-orbitron text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
        >
          {project.title}
        </motion.h1>

        {/* Description & Tech Stack Container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-background-elevated/30 border border-white/10 rounded-lg"
          style={{ padding: fluidSizing.space.lg, marginBottom: fluidSizing.space.lg }}
        >
          {/* Description */}
          <p className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed max-w-4xl" style={{ marginBottom: fluidSizing.space.md }}>
            {project.longDescription || project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap" style={{ gap: fluidSizing.space.sm }}>
            {project.tech.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
              >
                {/* Mobile: Solo icono sin badge */}
                <div className="sm:hidden text-white/80">
                  <TechIcon tech={tech} className="w-5 h-5" />
                </div>
                
                {/* Desktop: Badge con icono + nombre */}
                <div className="hidden sm:block">
                  <Badge variant="blue">
                    <span className="flex items-center gap-1.5">
                      <TechIcon tech={tech} className="w-3.5 h-3.5" />
                      <span>{tech}</span>
                    </span>
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap"
          style={{ gap: fluidSizing.space.md }}
        >
          {project.demoUrl && (
            <motion.a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white rounded-lg text-white font-rajdhani font-semibold text-sm transition-all duration-300 flex items-center gap-2 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="relative z-10">
                {project.status === 'completed' ? t('projects.viewPage') : t('projects.viewDemo')}
              </span>
            </motion.a>
          )}
          
          {project.repoUrl && (
            <motion.a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 bg-transparent border border-white/30 hover:border-white rounded-lg text-white font-rajdhani font-semibold text-sm transition-all duration-300 flex items-center gap-2 hover:bg-white/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>{t('projects.viewCode')}</span>
            </motion.a>
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
