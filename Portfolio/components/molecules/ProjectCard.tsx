'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import StatCard from '../atoms/StatCard';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { TechIcon } from '@/lib/utils/techIcons';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import type { Project } from '@/shared/types';

interface ProjectCardProps {
  project: Project;
  viewMode?: 'grid' | 'list';
}

export default function ProjectCard({ project, viewMode = 'grid' }: ProjectCardProps) {
  const { t } = useLanguage();
  const { lowPerformanceMode } = usePerformance();
  const pathname = usePathname();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    const targetPath = `/projects/${project.slug}`;
    if (pathname !== targetPath) {
      window.dispatchEvent(new Event('app:navigation-start'));
    }
  };

  return (
    <Link href={`/projects/${project.slug}`} onClick={handleClick}>
      <motion.div
        initial={lowPerformanceMode ? false : { opacity: 0, y: 20 }}
        whileInView={lowPerformanceMode ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={lowPerformanceMode ? {} : { duration: 0.5 }}
        whileHover={lowPerformanceMode ? {} : { scale: 1.05, transition: { duration: 0.2 } }}
        whileTap={lowPerformanceMode ? {} : { scale: 0.98, transition: { duration: 0.1 } }}
        className="group h-full"
      >
        <div className="relative h-full bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden transition-all duration-300 flex flex-col">

          {/* Featured badge */}
          {project.featured && (
            <motion.div
              className="absolute z-50 bg-white/10 backdrop-blur-sm text-white text-[8px] sm:text-[10px] font-orbitron font-bold rounded border border-white/50 flex items-center shadow-lg shadow-white/20"
              style={{ top: fluidSizing.space.sm, right: fluidSizing.space.sm, padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, gap: fluidSizing.space.xs }}
              initial={lowPerformanceMode ? false : { opacity: 0, x: 20 }}
              animate={lowPerformanceMode ? {} : { opacity: 1, x: 0 }}
              transition={lowPerformanceMode ? {} : { type: 'spring', stiffness: 150, delay: 0.2 }}
            >
              <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-cyber-red" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="hidden sm:inline">FEATURED</span>
            </motion.div>
          )}

          {/* Image/Screenshot Section */}
          <div className="relative w-full aspect-video bg-background-elevated overflow-hidden">
            {project.images?.[0] && !imageError ? (
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-background-elevated">
                <span className="text-6xl sm:text-7xl opacity-30">🚀</span>
              </div>
            )}

            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Category badge */}
            <div className="absolute z-20" style={{ bottom: fluidSizing.space.sm, left: fluidSizing.space.sm }}>
              <span className="bg-background-dark/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-mono rounded-full border border-white/50" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}` }}>
                {project.categories?.[0]?.toUpperCase() || 'PROJECT'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col relative z-10" style={{ padding: fluidSizing.space.md }}>
            {/* Title */}
            <h3 className="font-orbitron text-sm sm:text-base md:text-lg font-bold text-white transition-all duration-300 line-clamp-1" style={{ marginBottom: fluidSizing.space.sm }}>
              {project.title}
            </h3>
            
            {/* Description */}
            <p className="text-text-secondary text-xs sm:text-sm leading-relaxed flex-1 line-clamp-2" style={{ marginBottom: fluidSizing.space.sm }}>
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap" style={{ gap: fluidSizing.space.xs, marginBottom: fluidSizing.space.sm }}>
              {project.technologies?.slice(0, 6).map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={lowPerformanceMode ? false : { opacity: 0, scale: 0.8 }}
                  animate={lowPerformanceMode ? {} : { opacity: 1, scale: 1 }}
                  transition={lowPerformanceMode ? {} : { delay: index * 0.05 }}
                >
                  {/* Mobile: Solo icono sin badge */}
                  <div className="sm:hidden text-white/80">
                    <TechIcon tech={tech.name} className="w-4 h-4" />
                  </div>
                  
                  {/* Desktop: Badge con icono + nombre */}
                  <div className="hidden sm:block">
                    <Badge variant="blue">
                      <span className="flex items-center gap-1">
                        <TechIcon tech={tech.name} className="w-3.5 h-3.5" />
                        <span>{tech.name}</span>
                      </span>
                    </Badge>
                  </div>
                </motion.div>
              ))}
              {(project.technologies?.length || 0) > 6 && (
                <Badge variant="default">
                  +{(project.technologies?.length || 0) - 6}
                </Badge>
              )}
            </div>

            {/* Stats - Metrics */}
            {(project.performanceScore || project.accessibilityScore || project.seoScore) && (
              <>
                {/* Desktop: Grid */}
                <div className="hidden sm:grid grid-cols-3" style={{ gap: fluidSizing.space.xs, marginBottom: fluidSizing.space.md }}>
                  <StatCard label="Perf" value={project.performanceScore || 0} index={0} compact />
                  <StatCard label="A11y" value={project.accessibilityScore || 0} index={1} compact />
                  <StatCard label="SEO" value={project.seoScore || 0} index={2} compact />
                </div>
                
                {/* Mobile: Vertical List con contenedor */}
                <div className="sm:hidden bg-background-elevated/50 border border-white/10 rounded-md" style={{ marginBottom: fluidSizing.space.sm, padding: fluidSizing.space.sm }}>
                  <div className="flex flex-col gap-1 text-[10px] font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Perf</span>
                      <span className="text-white font-bold">{project.performanceScore || 0}</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">A11y</span>
                      <span className="text-white font-bold">{project.accessibilityScore || 0}</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">SEO</span>
                      <span className="text-white font-bold">{project.seoScore || 0}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* View Now Button */}
            <Button variant="outline" size="md" className="w-full border-white text-white hover:bg-white hover:text-black">
              <span className="hidden sm:inline">{t('projects.viewNow') || 'Ver Ahora'}</span>
              <span className="sm:inline-block md:hidden">Ver</span>
            </Button>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-white opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-white opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>
    </Link>
  );
}
