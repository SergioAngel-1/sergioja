import React, { forwardRef } from 'react';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = '', id, ...props }, ref) => {
    const inputId = id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-mono text-white uppercase tracking-wider text-fluid-xs"
            style={{ marginBottom: fluidSizing.space.sm }}
          >
            {label} {required && '*'}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-background-elevated border border-white/20 rounded-lg focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-text-primary font-rajdhani placeholder:text-text-muted ${className}`}
          style={{
            padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
            fontSize: '16px',
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400 font-rajdhani">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
