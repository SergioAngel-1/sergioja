import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { fluidSizing } from '@/lib/fluidSizing';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    size = 'md', 
    error = false,
    helperText,
    label,
    className, 
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const sizeStyles = {
      sm: {
        padding: fluidSizing.space.sm,
        fontSize: fluidSizing.text.sm,
      },
      md: {
        padding: fluidSizing.space.md,
        fontSize: fluidSizing.text.base,
      },
      lg: {
        padding: fluidSizing.space.lg,
        fontSize: fluidSizing.text.lg,
      },
    };

    const labelSizeStyles = {
      sm: {
        fontSize: fluidSizing.text.xs,
        marginBottom: fluidSizing.space.xs,
      },
      md: {
        fontSize: fluidSizing.text.sm,
        marginBottom: fluidSizing.space.sm,
      },
      lg: {
        fontSize: fluidSizing.text.base,
        marginBottom: fluidSizing.space.sm,
      },
    };

    const helperSizeStyles = {
      sm: {
        fontSize: fluidSizing.text.xs,
        marginTop: fluidSizing.space.xs,
      },
      md: {
        fontSize: fluidSizing.text.xs,
        marginTop: fluidSizing.space.xs,
      },
      lg: {
        fontSize: fluidSizing.text.sm,
        marginTop: fluidSizing.space.sm,
      },
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-medium text-admin-gray-light"
            style={labelSizeStyles[size]}
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-admin-dark-elevated border rounded-lg',
            'text-admin-primary placeholder:text-admin-gray-medium',
            'focus:outline-none focus:ring-2 focus:border-admin-primary',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error 
              ? 'border-admin-error focus:ring-admin-error/50' 
              : 'border-admin-gray-dark focus:ring-admin-primary/50',
            className
          )}
          style={{
            ...sizeStyles[size],
            ...(props.style || {}),
          }}
          {...props}
        />

        {helperText && (
          <p
            className={cn(
              'font-mono',
              error ? 'text-admin-error' : 'text-admin-gray-medium'
            )}
            style={helperSizeStyles[size]}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
