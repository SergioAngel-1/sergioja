'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Icon from '../atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';

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
      className="group relative bg-admin-dark-elevated border border-admin-primary/20 rounded-lg transition-all duration-300 hover:border-admin-primary/50 hover:shadow-lg hover:shadow-admin-primary/10"
      style={{ padding: fluidSizing.space.md }}
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 cyber-grid opacity-5 rounded-lg" />

      {/* Content */}
      <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
        {/* Header */}
        <div className="flex items-start justify-between" style={{ gap: fluidSizing.space.sm }}>
          <div className="flex-1 min-w-0">
            <h3 className="font-orbitron font-bold text-admin-primary group-hover:text-glow-subtle transition-all duration-300 truncate" style={{ fontSize: fluidSizing.text.lg }}>
              {name}
            </h3>
            <p className="text-text-muted uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
              {categoryLabels[category] || category}
            </p>
          </div>

          {/* Icon or color indicator */}
          <div
            className="rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
            style={{
              width: fluidSizing.size.buttonLg,
              height: fluidSizing.size.buttonLg,
              backgroundColor: `${color}20`,
              borderColor: `${color}40`,
              color: color,
            }}
          >
            {icon ? (
              <div className="relative w-8 h-8">
                <Image src={icon} alt={name} fill className="object-contain" sizes="32px" />
              </div>
            ) : (
              <Icon name="code" size={24} />
            )}
          </div>
        </div>

        {/* Proficiency bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xs }}>
          <div className="flex items-center justify-between" style={{ fontSize: fluidSizing.text.xs }}>
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
          <div className="flex items-center justify-between text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>
            <span>0%</span>
            <span className="font-medium" style={{ color }}>
              {proficiency}%
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 border-t border-admin-primary/10" style={{ gap: fluidSizing.space.sm, paddingTop: fluidSizing.space.sm }}>
          <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ 
                width: fluidSizing.size.buttonSm,
                height: fluidSizing.size.buttonSm,
                backgroundColor: `${color}10`,
                color 
              }}
            >
              <Icon name="zap" size={14} />
            </div>
            <div>
              <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>Experiencia</p>
              <p className="font-bold text-text-primary" style={{ fontSize: fluidSizing.text.sm }}>
                {yearsOfExperience} {yearsOfExperience === 1 ? 'año' : 'años'}
              </p>
            </div>
          </div>

          <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ 
                width: fluidSizing.size.buttonSm,
                height: fluidSizing.size.buttonSm,
                backgroundColor: `${color}10`,
                color 
              }}
            >
              <Icon name="projects" size={14} />
            </div>
            <div>
              <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>Proyectos</p>
              <p className="font-bold text-text-primary" style={{ fontSize: fluidSizing.text.sm }}>{projectCount}</p>
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
