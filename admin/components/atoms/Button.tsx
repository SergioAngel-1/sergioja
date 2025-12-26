import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fluidSizing } from '@/lib/fluidSizing';
import Icon from './Icon';

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'
> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-admin-primary hover:bg-admin-primary/90 text-admin-dark font-semibold',
    secondary: 'bg-admin-dark-surface hover:bg-admin-dark-elevated text-text-primary border border-admin-primary/20 hover:border-admin-primary/50',
    danger: 'bg-admin-error hover:bg-admin-error/80 text-white',
    ghost: 'bg-transparent hover:bg-admin-dark-surface text-text-secondary hover:text-text-primary',
    outline: 'bg-transparent text-text-secondary border border-admin-primary/20 hover:border-admin-primary/50 hover:text-text-primary hover:bg-admin-dark-surface',
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
      ref={ref}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth && 'w-full',
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
              variant === 'primary' ? 'border-admin-dark' : 'border-admin-primary'
            )}
            style={{
              width: fluidSizing.size.iconSm,
              height: fluidSizing.size.iconSm,
            }}
          ></span>
          Cargando...
        </span>
      ) : (
        <span className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
          {icon && iconPosition === 'left' && <Icon name={icon} size={20} />}
          {children}
          {icon && iconPosition === 'right' && <Icon name={icon} size={20} />}
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
