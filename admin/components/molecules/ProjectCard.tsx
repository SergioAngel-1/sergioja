'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Icon from '../atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';

interface ProjectCardProps {
  id: string;
  title: string;
  longDescriptionEs?: string | null;
  longDescriptionEn?: string | null;
  category?: string;
  thumbnailImage?: string | null;
  isFeatured: boolean;
  status: 'DRAFT' | 'IN_PROGRESS' | 'PUBLISHED';
  demoUrl?: string | null;
  repoUrl?: string | null;
  publishedAt?: Date | null;
  technologies?: { name: string; color: string }[];
  delay?: number;
  onEdit?: () => void;
}

export default function ProjectCard({
  id,
  title,
  longDescriptionEs,
  longDescriptionEn,
  category,
  thumbnailImage,
  isFeatured,
  status,
  demoUrl,
  repoUrl,
  publishedAt,
  technologies = [],
  delay = 0,
  onEdit,
}: ProjectCardProps) {
  const excerptFromLongDescription = (text?: string | null) => {
    if (!text) return '';
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized) return '';
    return normalized.length > 120 ? `${normalized.slice(0, 120)}…` : normalized;
  };

  const excerpt = excerptFromLongDescription(longDescriptionEs) || excerptFromLongDescription(longDescriptionEn);

  const categoryColors: Record<string, string> = {
    web: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    mobile: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    ai: 'text-green-400 border-green-400/30 bg-green-400/10',
    backend: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    fullstack: 'text-red-400 border-red-400/30 bg-red-400/10',
  };

  const categoryColor = category ? (categoryColors[category] || categoryColors.web) : categoryColors.web;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="group relative bg-admin-dark-elevated border border-admin-primary/20 rounded-lg transition-all duration-300 hover:border-admin-primary/50 hover:shadow-lg hover:shadow-admin-primary/10 overflow-hidden"
    >
      <div 
        className="flex flex-col sm:flex-row sm:items-center cursor-pointer" 
        style={{ padding: fluidSizing.space.md, gap: fluidSizing.space.md }}
        onClick={onEdit}
      >
        {/* Image section - compacta */}
        <div
          className="relative flex-shrink-0 bg-admin-dark-surface rounded-lg overflow-hidden w-full sm:w-auto"
          style={{ width: '120px', height: '80px' }}
        >
          {thumbnailImage ? (
            <Image
              src={thumbnailImage}
              alt={title}
              fill
              className="object-cover"
              sizes="120px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center cyber-grid">
              <Icon name="projects" size={32} className="text-admin-primary/30" />
            </div>
          )}
        </div>

        {/* Content section - horizontal */}
        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center" style={{ gap: fluidSizing.space.lg }}>
          {/* Info principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.xs }}>
              <h3 className="font-orbitron font-bold text-admin-primary group-hover:text-glow-subtle transition-all duration-300 truncate" style={{ fontSize: fluidSizing.text.base }}>
                {title}
              </h3>
              {isFeatured && (
                <span className="bg-admin-primary text-admin-dark rounded-full font-bold flex items-center flex-shrink-0" style={{ padding: `2px ${fluidSizing.space.xs}`, gap: '4px', fontSize: '10px' }}>
                  <Icon name="zap" size={10} />
                  DESTACADO
                </span>
              )}
            </div>
            {excerpt && (
              <p className="text-text-muted line-clamp-1" style={{ fontSize: fluidSizing.text.sm }}>
                {excerpt}
              </p>
            )}
          </div>

          {/* Meta row: categoría, tecnologías, status y acciones (wrapping en mobile) */}
          <div
            className="flex flex-wrap items-center justify-between w-full md:w-auto"
            style={{ gap: fluidSizing.space.sm }}
          >
            <div className="flex flex-wrap items-center min-w-0" style={{ gap: fluidSizing.space.sm }}>
              {/* Category badge */}
              {category && (
                <div className="flex-shrink-0">
                  <span className={`rounded-md font-medium border ${categoryColor}`} style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.xs }}>
                    {category.toUpperCase()}
                  </span>
                </div>
              )}

              {/* Technologies */}
              {technologies.length > 0 && (
                <div className="flex flex-wrap min-w-0" style={{ gap: fluidSizing.space.xs }}>
                  {technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="rounded border border-admin-primary/20 bg-admin-dark-surface text-text-secondary max-w-[140px] truncate"
                      style={{ 
                        padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                        fontSize: fluidSizing.text.xs,
                        borderColor: `${tech.color}40`,
                        color: tech.color 
                      }}
                      title={tech.name}
                    >
                      {tech.name}
                    </span>
                  ))}
                  {technologies.length > 3 && (
                    <span className="rounded border border-admin-primary/20 bg-admin-dark-surface text-text-muted" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.xs }}>
                      +{technologies.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center flex-wrap justify-end" style={{ gap: fluidSizing.space.sm }}>
              {/* Quick actions */}
              <div className="flex" style={{ gap: fluidSizing.space.xs }}>
                {demoUrl && (
                  <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-admin-dark-surface border border-admin-primary/30 rounded-lg flex items-center justify-center text-admin-primary hover:bg-admin-primary hover:text-admin-dark transition-all duration-200"
                    style={{ width: '32px', height: '32px' }}
                    onClick={(e) => e.stopPropagation()}
                    title="Ver demo"
                  >
                    <Icon name="eye" size={14} />
                  </a>
                )}
                {repoUrl && (
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-admin-dark-surface border border-admin-primary/30 rounded-lg flex items-center justify-center text-admin-primary hover:bg-admin-primary hover:text-admin-dark transition-all duration-200"
                    style={{ width: '32px', height: '32px' }}
                    onClick={(e) => e.stopPropagation()}
                    title="Ver código"
                  >
                    <Icon name="code" size={14} />
                  </a>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center text-text-muted" style={{ gap: fluidSizing.space.xs, fontSize: fluidSizing.text.xs }}>
                {status === 'PUBLISHED' && publishedAt ? (
                  <>
                    <Icon name="zap" size={12} />
                    <span className="whitespace-nowrap">
                      {new Date(publishedAt).toLocaleDateString('es-ES', {
                        month: 'short',
                        year: '2-digit',
                      })}
                    </span>
                  </>
                ) : status === 'IN_PROGRESS' ? (
                  <span className="text-admin-primary whitespace-nowrap">En proceso</span>
                ) : (
                  <span className="text-admin-warning whitespace-nowrap">Borrador</span>
                )}
              </div>

              {/* Edit affordance */}
              <div className="flex items-center text-admin-primary font-medium group-hover:translate-x-1 transition-transform duration-300" style={{ gap: fluidSizing.space.xs, fontSize: fluidSizing.text.xs }}>
                <span className="hidden sm:inline">Editar</span>
                <Icon name="chevronRight" size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-admin-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
