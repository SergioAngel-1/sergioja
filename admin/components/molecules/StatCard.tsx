'use client';

import { motion } from 'framer-motion';
import Icon from '../atoms/Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
  variant?: 'default' | 'accent' | 'simple';
  color?: string; // Color personalizado para el valor y borde (e.g., 'green-400', 'blue-400', 'admin-primary')
  className?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend,
  delay = 0,
  variant = 'default',
  color,
  className = ''
}: StatCardProps) {
  const isAccent = variant === 'accent';
  const isSimple = variant === 'simple';
  
  // Determinar clases de color basadas en el prop color
  const getColorClasses = () => {
    if (!color) {
      return {
        text: 'text-admin-primary',
        border: 'border-admin-primary/20',
        hoverBorder: 'hover:border-admin-primary/50',
        iconBg: 'bg-admin-primary/10',
        iconBorder: 'border-admin-primary/30',
        iconText: 'text-admin-primary',
        iconHoverBg: 'group-hover:bg-admin-primary/20',
        iconHoverBorder: 'group-hover:border-admin-primary/50'
      };
    }

    return {
      text: `text-${color}`,
      border: `border-${color}/20`,
      hoverBorder: `hover:border-${color}/50`,
      iconBg: `bg-${color}/10`,
      iconBorder: `border-${color}/30`,
      iconText: `text-${color}`,
      iconHoverBg: `group-hover:bg-${color}/20`,
      iconHoverBorder: `group-hover:border-${color}/50`
    };
  };

  const colorClasses = getColorClasses();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`
        relative group
        bg-admin-dark-elevated 
        ${colorClasses.border}
        rounded-lg
        ${isSimple ? 'p-4' : 'p-6'}
        transition-all duration-300
        ${colorClasses.hoverBorder}
        ${isAccent ? 'hover:shadow-lg hover:shadow-admin-primary/10' : ''}
        ${!isSimple ? 'hover:shadow-md hover:shadow-black/20' : ''}
        ${className}
      `}
    >
      {/* Background grid effect - solo en variant default y accent */}
      {!isSimple && <div className="absolute inset-0 cyber-grid opacity-5 rounded-lg" />}
      
      {/* Animated corner accent - solo en variant default y accent */}
      {!isSimple && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-admin-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-lg" />
      )}
      
      {/* Content */}
      <div className={`relative z-10 ${icon && !isSimple ? 'flex items-start justify-between gap-4' : 'flex items-center justify-between gap-4'}`}>
        <div className="flex-1">
          <p className={`text-text-muted ${isSimple ? 'text-xs' : 'text-sm'} font-medium uppercase tracking-wider ${isSimple ? 'mb-1' : 'mb-2'}`}>
            {title}
          </p>
          
          {/* Valor debajo del título cuando hay icono */}
          {icon && !isSimple && (
            <p className={`text-3xl md:text-4xl font-orbitron font-bold text-white text-glow-subtle`}>
              {value}
            </p>
          )}
          
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend.isPositive ? 'text-admin-success' : 'text-admin-error'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="font-medium">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        {/* Valor a la derecha cuando NO hay icono */}
        {!icon && (
          <div className="flex-shrink-0">
            <p className={`${isSimple ? 'text-2xl' : 'text-3xl md:text-4xl'} font-orbitron font-bold text-white ${!isSimple ? 'text-glow-subtle' : ''}`}>
              {value}
            </p>
          </div>
        )}
        
        {/* Icono a la derecha */}
        {icon && !isSimple && (
          <div className="flex-shrink-0">
            <div className={`
              w-12 h-12 rounded-lg
              flex items-center justify-center
              ${colorClasses.iconBg}
              border ${colorClasses.iconBorder}
              ${colorClasses.iconText}
              transition-all duration-300
              ${colorClasses.iconHoverBg}
              ${colorClasses.iconHoverBorder}
            `}>
              <Icon name={icon} size={24} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
