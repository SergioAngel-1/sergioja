'use client';

import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
  variant?: 'default' | 'accent';
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend,
  delay = 0,
  variant = 'default'
}: StatCardProps) {
  const isAccent = variant === 'accent';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`
        relative group
        bg-admin-dark-elevated 
        border border-admin-primary/20
        rounded-lg p-6
        transition-all duration-300
        hover:border-admin-primary/50
        ${isAccent ? 'hover:glow-white' : ''}
      `}
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 cyber-grid opacity-5" />
      
      {/* Animated corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-admin-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="text-3xl md:text-4xl font-orbitron font-bold text-admin-primary text-glow-subtle">
            {value}
          </p>
          
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend.isPositive ? 'text-admin-success' : 'text-admin-error'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="font-medium">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <div className={`
            w-12 h-12 rounded-lg
            flex items-center justify-center
            bg-admin-primary/10
            border border-admin-primary/30
            text-admin-primary
            transition-all duration-300
            group-hover:bg-admin-primary/20
            group-hover:border-admin-primary/50
          `}>
            <Icon name={icon} size={24} />
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-admin-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
