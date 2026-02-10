'use client';

import { motion } from 'framer-motion';
import { sanitizeSvg } from '@/lib/utils/sanitizeSvg';
import type { Skill } from '@/shared/types';

interface SkillCardProps {
  skill: Skill;
  delay?: number;
}

export default function SkillCard({ skill, delay = 0 }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.15 }}
      className="group"
    >
      <div className="relative bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg p-2.5 sm:p-3 hover:border-white/50 transition-all duration-300 overflow-hidden">
        {/* SVG Icon in top-right corner */}
        {skill.icon && (
          <div 
            className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 opacity-30 group-hover:opacity-50 transition-opacity duration-300 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
            dangerouslySetInnerHTML={{ __html: sanitizeSvg(skill.icon) }}
          />
        )}

        {/* Skill name */}
        <div className="mb-1.5 pr-6">
          <h4 className="font-orbitron text-xs font-bold text-white truncate">
            {skill.name}
          </h4>
        </div>

        {/* Proficiency percentage */}
        <div className="font-orbitron text-lg sm:text-xl font-bold text-white mb-1.5">
          {skill.proficiency}%
        </div>

        {/* Progress bar */}
        <div className="relative h-0.5 bg-background-elevated rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${skill.proficiency}%` }}
            transition={{ delay, duration: 0.4, ease: 'easeOut' }}
            className="absolute h-full rounded-full"
            style={{
              background: `linear-gradient(to right, ${skill.color}, ${skill.color}CC)`,
              boxShadow: `0 0 8px ${skill.color}80`,
            }}
          />
        </div>

        {/* Years at bottom */}
        {skill.yearsOfExperience > 0 && (
          <div className="text-[10px] text-text-muted font-mono">
            {skill.yearsOfExperience}{skill.yearsOfExperience === 1 ? ' año' : ' años'}
          </div>
        )}

        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"
        />
      </div>
    </motion.div>
  );
}
