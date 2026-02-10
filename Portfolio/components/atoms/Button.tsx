import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'red' | 'blue' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'red',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-orbitron font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    red: 'btn-neon',
    blue: 'btn-neon-blue',
    outline: 'border border-text-secondary text-text-secondary hover:border-text-primary hover:text-text-primary sm:border-2',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-4 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
