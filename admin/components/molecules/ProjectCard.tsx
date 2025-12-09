'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Icon from '../atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string | null;
  featured: boolean;
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
  description,
  category,
  image,
  featured,
  demoUrl,
  repoUrl,
  publishedAt,
  technologies = [],
  delay = 0,
  onEdit,
}: ProjectCardProps) {
  const categoryColors: Record<string, string> = {
    web: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    mobile: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    ai: 'text-green-400 border-green-400/30 bg-green-400/10',
    backend: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    fullstack: 'text-red-400 border-red-400/30 bg-red-400/10',
  };

  const categoryColor = categoryColors[category] || categoryColors.web;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="group relative bg-admin-dark-elevated border border-admin-primary/20 rounded-lg transition-all duration-300 hover:border-admin-primary/50 hover:shadow-lg hover:shadow-admin-primary/10"
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="bg-admin-primary text-admin-dark rounded-full font-bold flex items-center shadow-lg" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, gap: fluidSizing.space.xs, fontSize: fluidSizing.text.xs }}>
            <Icon name="zap" size={12} />
            DESTACADO
          </div>
        </div>
      )}

      {/* Image section */}
      <div className="relative h-48 bg-admin-dark-surface rounded-t-lg overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center cyber-grid">
            <Icon name="projects" size={48} className="text-admin-primary/30" />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-admin-dark-elevated via-transparent to-transparent opacity-60" />
        
        {/* Category badge */}
        <div className="absolute" style={{ top: fluidSizing.space.sm, left: fluidSizing.space.sm }}>
          <span className={`rounded-md font-medium border ${categoryColor} backdrop-blur-sm`} style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.xs }}>
            {category.toUpperCase()}
          </span>
        </div>

        {/* Quick actions */}
        <div className="absolute flex opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ top: fluidSizing.space.sm, right: fluidSizing.space.sm, gap: fluidSizing.space.xs }}>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-admin-dark/80 backdrop-blur-sm border border-admin-primary/30 rounded-lg flex items-center justify-center text-admin-primary hover:bg-admin-primary hover:text-admin-dark transition-all duration-200"
              style={{ width: fluidSizing.size.buttonSm, height: fluidSizing.size.buttonSm }}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="eye" size={16} />
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-admin-dark/80 backdrop-blur-sm border border-admin-primary/30 rounded-lg flex items-center justify-center text-admin-primary hover:bg-admin-primary hover:text-admin-dark transition-all duration-200"
              style={{ width: fluidSizing.size.buttonSm, height: fluidSizing.size.buttonSm }}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="code" size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Content section */}
      <div 
        className="block cursor-pointer" 
        style={{ padding: fluidSizing.space.md }}
        onClick={onEdit}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}>
          {/* Title */}
          <h3 className="font-orbitron font-bold text-admin-primary group-hover:text-glow-subtle transition-all duration-300 line-clamp-1" style={{ fontSize: fluidSizing.text.lg }}>
            {title}
          </h3>

          {/* Description */}
          <p className="text-text-muted line-clamp-2 leading-relaxed" style={{ fontSize: fluidSizing.text.sm }}>
            {description}
          </p>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: fluidSizing.space.xs }}>
              {technologies.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="rounded border border-admin-primary/20 bg-admin-dark-surface text-text-secondary"
                  style={{ 
                    padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                    fontSize: fluidSizing.text.xs,
                    borderColor: `${tech.color}40`,
                    color: tech.color 
                  }}
                >
                  {tech.name}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="rounded border border-admin-primary/20 bg-admin-dark-surface text-text-muted" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, fontSize: fluidSizing.text.xs }}>
                  +{technologies.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-admin-primary/10" style={{ paddingTop: fluidSizing.space.sm }}>
            <div className="flex items-center text-text-muted" style={{ gap: fluidSizing.space.xs, fontSize: fluidSizing.text.xs }}>
              {publishedAt ? (
                <>
                  <Icon name="zap" size={12} />
                  <span>
                    {new Date(publishedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </>
              ) : (
                <span className="text-admin-warning">Borrador</span>
              )}
            </div>

            <div className="flex items-center text-admin-primary font-medium group-hover:translate-x-1 transition-transform duration-300" style={{ gap: fluidSizing.space.xs, fontSize: fluidSizing.text.xs }}>
              <span>Editar</span>
              <Icon name="chevronRight" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-admin-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
