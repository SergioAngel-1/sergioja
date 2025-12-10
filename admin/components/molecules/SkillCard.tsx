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
  onEdit?: () => void;
  onDelete?: () => void;
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
  onEdit,
  onDelete,
}: SkillCardProps) {
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

      {/* Action buttons */}
      <div className="absolute top-2 right-2 z-20 flex flex-col opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ gap: fluidSizing.space.xs }}>
        {onEdit && (
          <button
            onClick={onEdit}
            className="bg-admin-dark-surface/80 hover:bg-admin-primary/20 border border-admin-primary/30 hover:border-admin-primary rounded-lg p-2 transition-all duration-300"
            aria-label="Editar tecnología"
          >
            <Icon name="edit" size={16} className="text-admin-primary" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-admin-dark-surface/80 hover:bg-admin-error/20 border border-admin-error/30 hover:border-admin-error rounded-lg p-2 transition-all duration-300"
            aria-label="Eliminar tecnología"
          >
            <Icon name="trash" size={16} className="text-admin-error" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
        {/* Header */}
        <div className="flex items-start justify-between" style={{ gap: fluidSizing.space.sm }}>
          <div className="flex-1 min-w-0">
            <h3 className="font-orbitron font-bold text-admin-primary group-hover:text-glow-subtle transition-all duration-300 truncate" style={{ fontSize: fluidSizing.text.lg }}>
              {name}
            </h3>
            <p className="text-text-muted uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
              {category}
            </p>
          </div>

          {/* Icon or color indicator */}
          <div
            className="rounded-lg flex items-center justify-center border border-admin-primary/20 transition-all duration-300 group-hover:scale-110 bg-admin-dark-surface text-admin-primary"
            style={{
              width: fluidSizing.size.buttonLg,
              height: fluidSizing.size.buttonLg,
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
            <span className="font-medium text-text-primary">
              {proficiency}%
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 border-t border-admin-primary/10" style={{ gap: fluidSizing.space.sm, paddingTop: fluidSizing.space.sm }}>
          <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
            <div
              className="rounded-lg flex items-center justify-center bg-admin-primary/10 text-admin-primary"
              style={{ 
                width: fluidSizing.size.buttonSm,
                height: fluidSizing.size.buttonSm,
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
              className="rounded-lg flex items-center justify-center bg-admin-primary/10 text-admin-primary"
              style={{ 
                width: fluidSizing.size.buttonSm,
                height: fluidSizing.size.buttonSm,
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
