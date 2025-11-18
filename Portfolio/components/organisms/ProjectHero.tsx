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
      transition={{ delay: 0.2, duration: 0.6 }}
      className="relative group w-full"
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
      <div className="relative h-full bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300" style={{ padding: `${fluidSizing.space.lg} ${fluidSizing.space.xl}` }}>
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

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed max-w-4xl"
          style={{ marginBottom: fluidSizing.space.lg }}
        >
          {project.longDescription || project.description}
        </motion.p>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap"
          style={{ gap: fluidSizing.space.sm }}
        >
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
        </motion.div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg pointer-events-none"
        />
      </div>
    </motion.div>
  );
}
