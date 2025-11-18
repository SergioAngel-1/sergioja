'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Badge from '../atoms/Badge';
import StatCard from '../atoms/StatCard';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { TechIcon } from '@/lib/utils/techIcons';
import type { Project } from '../../../shared/types';

interface ProjectCardProps {
  project: Project;
  viewMode?: 'grid' | 'list';
}

export default function ProjectCard({ project, viewMode = 'grid' }: ProjectCardProps) {
  const { t } = useLanguage();

  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group h-full"
      >
        <div className="relative h-full bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-white hover:shadow-glow-white flex flex-col">
          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          />

          {/* Featured badge */}
          {project.featured && (
            <motion.div
              className="absolute top-2 right-2 z-50 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white/10 backdrop-blur-sm text-white text-[8px] sm:text-[10px] font-orbitron font-bold rounded border border-white/50 flex items-center gap-0.5 sm:gap-1 shadow-lg shadow-white/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
            >
              <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="hidden sm:inline">FEATURED</span>
            </motion.div>
          )}

          {/* Image/Screenshot Section */}
          <div className="relative w-full aspect-video bg-background-elevated overflow-hidden">
            {/* Placeholder gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-text-secondary/10 to-white/10" />
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>
            
            {/* Project icon/emoji */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl opacity-30">🚀</span>
            </div>

            {/* Category badge */}
            <div className="absolute bottom-2 left-2 z-20">
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-background-dark/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-mono rounded-full border border-white/50">
                {project.category.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-3 sm:p-4 relative z-10">
            {/* Title */}
            <h3 className="font-orbitron text-sm sm:text-base md:text-lg font-bold mb-1.5 sm:mb-2 text-white transition-all duration-300 line-clamp-1">
              {project.title}
            </h3>
            
            {/* Description */}
            <p className="text-text-secondary text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed flex-1 line-clamp-2">
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
              {project.tech.slice(0, 6).map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Mobile: Solo icono sin badge */}
                  <div className="sm:hidden text-white/80">
                    <TechIcon tech={tech} className="w-4 h-4" />
                  </div>
                  
                  {/* Desktop: Badge con icono + nombre */}
                  <div className="hidden sm:block">
                    <Badge variant="blue">
                      <span className="flex items-center gap-1">
                        <TechIcon tech={tech} className="w-3.5 h-3.5" />
                        <span>{tech}</span>
                      </span>
                    </Badge>
                  </div>
                </motion.div>
              ))}
              {project.tech.length > 6 && (
                <Badge variant="default">
                  +{project.tech.length - 6}
                </Badge>
              )}
            </div>

            {/* Stats - Metrics */}
            {project.metrics && (
              <>
                {/* Desktop: Grid */}
                <div className="hidden sm:grid grid-cols-3 gap-1.5 mb-3">
                  <StatCard label="Perf" value={project.metrics.performance} index={0} compact />
                  <StatCard label="A11y" value={project.metrics.accessibility} index={1} compact />
                  <StatCard label="SEO" value={project.metrics.seo} index={2} compact />
                </div>
                
                {/* Mobile: Vertical List con contenedor */}
                <div className="sm:hidden mb-2 bg-background-elevated/50 border border-white/10 rounded-md p-2">
                  <div className="flex flex-col gap-1 text-[10px] font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Perf</span>
                      <span className="text-white font-bold">{project.metrics.performance}</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">A11y</span>
                      <span className="text-white font-bold">{project.metrics.accessibility}</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">SEO</span>
                      <span className="text-white font-bold">{project.metrics.seo}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* View Now Button */}
            <motion.button
              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white rounded-lg text-white font-rajdhani font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 group/btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="hidden sm:inline">{t('projects.viewNow') || 'Ver Ahora'}</span>
              <span className="sm:hidden">Ver</span>
              <motion.svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </motion.button>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-white opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-white opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>
    </Link>
  );
}
