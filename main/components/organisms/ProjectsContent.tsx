'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Project } from '@/lib/types';
import { fluidSizing } from '@/lib/fluidSizing';

export default function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getFeaturedProjects();
        if (response.success && response.data) {
          setProjects(response.data);
        } else {
          setError(response.error || 'Failed to load projects');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ padding: `${fluidSizing.space['2xl']} 0` }}>
        <div className="animate-pulse text-white/60 text-fluid-sm">Cargando proyectos...</div>
      </div>
    );
  }

  if (error || projects.length === 0) {
    return (
      <div className="text-center" style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md, padding: `${fluidSizing.space.xl} 0` }}>
        <p className="text-white/60 text-fluid-sm">No hay proyectos disponibles en este momento.</p>
        <a
          href="http://localhost:3000/work"
          className="inline-block text-white/80 hover:text-white underline text-fluid-sm"
        >
          Ver portafolio completo →
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}
      >
        <h3 className="text-white font-bold text-fluid-sm">Proyectos Destacados</h3>
        <div className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
      </motion.div>

      {/* Projects grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            style={{ padding: fluidSizing.space.md, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}
          >
            {/* Title and status */}
            <div className="flex items-start justify-between flex-1" style={{ gap: fluidSizing.space.sm }}>
              <h4 className="text-white font-medium group-hover:text-white/90 flex-1 text-fluid-sm">
                {project.title}
              </h4>
              {project.status === 'in-progress' && (
                <span className="rounded-full bg-white/10 text-white/60 font-mono text-fluid-xs" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}` }}>
                  EN DESARROLLO
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-white/70 leading-relaxed text-fluid-xs">
              {project.description}
            </p>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap" style={{ gap: fluidSizing.space.xs }}>
                {project.technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="rounded bg-white/5 text-white/60 font-mono text-fluid-xs"
                    style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}` }}
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="text-white/40 font-mono text-fluid-xs" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}` }}>
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Links */}
            <div className="flex items-center" style={{ gap: fluidSizing.space.md, paddingTop: fluidSizing.space.xs }}>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-white/60 hover:text-white transition-colors font-mono"
                >
                  Ver demo →
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-white/60 hover:text-white transition-colors font-mono"
                >
                  GitHub →
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Link to full portfolio */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
        style={{ paddingTop: fluidSizing.space.sm }}
      >
        <a
          href="http://localhost:3000/work"
          className="inline-block text-white/60 hover:text-white transition-colors font-mono text-fluid-xs"
        >
          Ver todos los proyectos →
        </a>
      </motion.div>
    </div>
  );
}
