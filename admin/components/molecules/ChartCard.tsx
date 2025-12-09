'use client';

import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';

interface ChartCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: 'projects' | 'eye' | 'users' | 'messages' | 'newsletter' | 'zap';
  color?: string;
  delay?: number;
  children?: React.ReactNode;
}

export default function ChartCard({
  title,
  value,
  change,
  icon,
  color,
  delay = 0,
  children,
}: ChartCardProps) {
  const isPositive = change && change.value >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg p-6 hover:border-admin-primary/40 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{title}</p>
          
          {change && (
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-sm font-medium ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-text-muted text-xs">{change.period}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <p className="text-3xl font-orbitron font-bold text-white">{value}</p>
          
          {icon && color && (
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: `${color}20`,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: `${color}40`,
                color: color,
              }}
            >
              <Icon name={icon} size={24} />
            </div>
          )}
        </div>
      </div>

      {/* Content (chart or additional info) */}
      {children && (
        <div className="pt-4 border-t border-admin-primary/10">
          {children}
        </div>
      )}
    </motion.div>
  );
}
