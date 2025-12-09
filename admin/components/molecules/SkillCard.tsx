'use client';

import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';

interface SkillCardProps {
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
  color: string;
  icon?: string | null;
  projectCount: number;
  delay?: number;
}

export default function SkillCard({
  name,
  category,
  proficiency,
  yearsOfExperience,
  color,
  icon,
  projectCount,
  delay = 0,
}: SkillCardProps) {
  const categoryLabels: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    devops: 'DevOps',
    design: 'Diseño',
    other: 'Otros',
  };

  const getProficiencyLabel = (level: number) => {
    if (level >= 90) return 'Experto';
    if (level >= 70) return 'Avanzado';
    if (level >= 50) return 'Intermedio';
    if (level >= 30) return 'Básico';
    return 'Principiante';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="group relative bg-admin-dark-elevated border border-admin-primary/20 rounded-lg p-5 transition-all duration-300 hover:border-admin-primary/50 hover:shadow-lg hover:shadow-admin-primary/10"
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 cyber-grid opacity-5 rounded-lg" />

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-orbitron font-bold text-admin-primary group-hover:text-glow-subtle transition-all duration-300 truncate">
              {name}
            </h3>
            <p className="text-text-muted text-xs uppercase tracking-wider mt-1">
              {categoryLabels[category] || category}
            </p>
          </div>

          {/* Icon or color indicator */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${color}20`,
              borderColor: `${color}40`,
              color: color,
            }}
          >
            {icon ? (
              <img src={icon} alt={name} className="w-8 h-8 object-contain" />
            ) : (
              <Icon name="code" size={24} />
            )}
          </div>
        </div>

        {/* Proficiency bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Dominio</span>
            <span className="text-text-primary font-medium">
              {getProficiencyLabel(proficiency)}
            </span>
          </div>
          <div className="h-2 bg-admin-dark-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${proficiency}%` }}
              transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
              className="h-full rounded-full transition-all duration-300"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}40`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>0%</span>
            <span className="font-medium" style={{ color }}>
              {proficiency}%
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-admin-primary/10">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}10`, color }}
            >
              <Icon name="zap" size={14} />
            </div>
            <div>
              <p className="text-xs text-text-muted">Experiencia</p>
              <p className="text-sm font-bold text-text-primary">
                {yearsOfExperience} {yearsOfExperience === 1 ? 'año' : 'años'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}10`, color }}
            >
              <Icon name="projects" size={14} />
            </div>
            <div>
              <p className="text-xs text-text-muted">Proyectos</p>
              <p className="text-sm font-bold text-text-primary">{projectCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, transparent, ${color}80, transparent)`,
        }}
      />
    </motion.div>
  );
}
