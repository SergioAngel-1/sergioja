'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { fluidSizing } from '@/lib/fluidSizing';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, icon, className, style, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <label style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xs }}>
        {label && (
          <span className="font-mono text-white/60 text-fluid-xs leading-tight">
            {label}
          </span>
        )}
        <div
          className={`flex items-center rounded border transition-colors ${className ?? ''}`}
          style={{
            gap: icon ? fluidSizing.space.sm : undefined,
            padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderColor: hasError ? 'rgba(254,76,76,0.6)' : 'rgba(255,255,255,0.2)',
            ...style,
          }}
        >
          {icon && <span className="text-white/60">{icon}</span>}
          <input
            ref={ref}
            {...props}
            className="flex-1 bg-transparent outline-none font-mono text-white placeholder:text-white/30 placeholder:text-xs text-fluid-xs"
            style={{ minWidth: 0, fontSize: '16px' }}
          />
        </div>
        {(error || helperText) && (
          <span
            className={`font-mono text-fluid-xs ${
              hasError ? 'text-red-400' : 'text-white/40'
            }`}
          >
            {error || helperText}
          </span>
        )}
      </label>
    );
  }
);

Input.displayName = 'Input';

export default Input;
