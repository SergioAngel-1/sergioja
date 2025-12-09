'use client';

import { motion } from 'framer-motion';

interface TopItemCardProps {
  rank: number;
  title: string;
  subtitle?: string;
  value: number;
  total: number;
  color: string;
  delay?: number;
}

export default function TopItemCard({
  rank,
  title,
  subtitle,
  value,
  total,
  color,
  delay = 0,
}: TopItemCardProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/40';
    if (rank === 2) return 'text-gray-300 bg-gray-300/20 border-gray-300/40';
    if (rank === 3) return 'text-orange-400 bg-orange-400/20 border-orange-400/40';
    return 'text-admin-primary bg-admin-primary/20 border-admin-primary/40';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="flex items-center gap-4 p-4 bg-admin-dark-surface border border-admin-primary/10 rounded-lg hover:border-admin-primary/30 transition-all duration-300"
    >
      {/* Rank badge */}
      <div
        className={`
          w-10 h-10 rounded-lg flex items-center justify-center font-orbitron font-bold text-lg border
          ${getRankColor(rank)}
        `}
      >
        {rank}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-text-primary font-medium truncate">{title}</h4>
        {subtitle && (
          <p className="text-text-muted text-xs truncate">{subtitle}</p>
        )}
      </div>

      {/* Stats */}
      <div className="text-right">
        <p className="text-text-primary font-bold">{value.toLocaleString()}</p>
        <p className="text-text-muted text-xs">{percentage}%</p>
      </div>

      {/* Progress bar */}
      <div className="w-20 h-2 bg-admin-dark-elevated rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}
