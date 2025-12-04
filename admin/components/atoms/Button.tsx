import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fluidSizing } from '@/lib/fluidSizing';

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'
> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-admin-primary hover:bg-admin-primary/90 text-admin-secondary glow-white font-semibold',
    secondary: 'bg-admin-secondary hover:bg-admin-dark-elevated text-admin-primary border border-admin-primary',
    danger: 'bg-admin-error hover:bg-admin-error/80 text-white',
    ghost: 'bg-transparent hover:bg-admin-dark-elevated text-admin-primary border border-admin-gray-medium hover:border-admin-primary',
  };

  const sizeStyles = {
    sm: {
      padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
      fontSize: fluidSizing.text.sm,
    },
    md: {
      padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
      fontSize: fluidSizing.text.base,
    },
    lg: {
      padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}`,
      fontSize: fluidSizing.text.lg,
    },
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{
        ...sizeStyles[size],
        ...(props.style || {}),
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
          <span 
            className={cn(
              "inline-block animate-spin rounded-full border-t-2 border-b-2",
              variant === 'primary' ? 'border-admin-secondary' : 'border-admin-primary'
            )}
            style={{
              width: fluidSizing.size.iconSm,
              height: fluidSizing.size.iconSm,
            }}
          ></span>
          Cargando...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
