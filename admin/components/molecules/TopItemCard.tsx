'use client';

import { motion } from 'framer-motion';
import { fluidSizing } from '@/lib/fluidSizing';

interface TopItemCardProps {
  rank: number;
  title: string;
  subtitle?: string;
  value: number;
  total: number;
  color?: string; // Opcional, se ignora para usar rojo
  delay?: number;
}

export default function TopItemCard({
  rank,
  title,
  subtitle,
  value,
  total,
  color: _color, // Ignorado
  delay = 0,
}: TopItemCardProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  // Escala de grises para el badge del ranking (más claro = mejor posición)
  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-white bg-white/20 border-white/40';
    if (rank === 2) return 'text-gray-300 bg-gray-300/15 border-gray-300/30';
    if (rank === 3) return 'text-gray-400 bg-gray-400/10 border-gray-400/25';
    return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  };

  // Intensidad de blanco basada en el porcentaje (más alto = más intenso)
  const getWhiteIntensity = (percentage: number) => {
    if (percentage >= 75) return 'bg-white/20';
    if (percentage >= 50) return 'bg-white/15';
    if (percentage >= 25) return 'bg-white/10';
    return 'bg-white/5';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="relative bg-admin-dark-surface border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300 overflow-hidden group"
      style={{ padding: fluidSizing.space.md }}
    >
      {/* Background progress bar (full width) */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
        className={`absolute inset-y-0 left-0 ${getWhiteIntensity(percentage)}`}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center" style={{ gap: fluidSizing.space.md }}>
        {/* Rank badge */}
        <div
          className={`
            rounded-lg flex items-center justify-center font-orbitron font-bold border flex-shrink-0
            ${getRankStyle(rank)}
          `}
          style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd, fontSize: fluidSizing.text.lg }}
        >
          {rank}
        </div>

        {/* Title and subtitle */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate" style={{ fontSize: fluidSizing.text.base }}>{title}</h4>
          {subtitle && (
            <p className="text-gray-400 truncate" style={{ fontSize: fluidSizing.text.xs }}>{subtitle}</p>
          )}
        </div>

        {/* Stats */}
        <div className="text-right flex-shrink-0">
          <p className="text-white font-bold" style={{ fontSize: fluidSizing.text.lg }}>{value.toLocaleString()}</p>
          <p className="text-gray-400" style={{ fontSize: fluidSizing.text.xs }}>{percentage}%</p>
        </div>
      </div>
    </motion.div>
  );
}
