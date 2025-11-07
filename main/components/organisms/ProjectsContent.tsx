'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Project } from '@/lib/types';

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
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-white/60 text-sm">Cargando proyectos...</div>
      </div>
    );
  }

  if (error || projects.length === 0) {
    return (
      <div className="space-y-4 text-center py-8">
        <p className="text-white/60 text-sm">No hay proyectos disponibles en este momento.</p>
        <a
          href="http://localhost:3000/work"
          className="inline-block text-white/80 hover:text-white text-sm underline"
        >
          Ver portafolio completo →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h3 className="text-white font-bold text-sm">Proyectos Destacados</h3>
        <div className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
      </motion.div>

      {/* Projects grid */}
      <div className="space-y-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-3 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 space-y-2"
          >
            {/* Title and status */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-white font-medium text-sm group-hover:text-white/90 flex-1">
                {project.title}
              </h4>
              {project.status === 'in-progress' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-mono">
                  EN DESARROLLO
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-white/70 text-xs leading-relaxed">
              {project.description}
            </p>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/60 font-mono"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 text-white/40 font-mono">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Links */}
            <div className="flex items-center gap-3 pt-1">
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
        className="pt-2 text-center"
      >
        <a
          href="http://localhost:3000/work"
          className="inline-block text-white/60 hover:text-white text-xs transition-colors font-mono"
        >
          Ver todos los proyectos →
        </a>
      </motion.div>
    </div>
  );
}
