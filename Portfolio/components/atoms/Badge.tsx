import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'red' | 'blue' | 'purple' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    red: 'bg-cyber-red/20 text-cyber-red border-cyber-red',
    blue: 'bg-white/10 text-white border-white/50',
    purple: 'bg-white/10 text-white border-white/50',
    default: 'bg-background-elevated text-text-secondary border-text-muted',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-xs font-rajdhani font-medium border rounded-full',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
