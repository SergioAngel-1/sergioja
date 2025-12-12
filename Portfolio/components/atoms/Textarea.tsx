import React, { forwardRef } from 'react';
import { fluidSizing, clamp } from '@/lib/utils/fluidSizing';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  minHeight?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, minHeight, className = '', id, ...props }, ref) => {
    const textareaId = id || props.name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full flex flex-col flex-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block font-mono text-white uppercase tracking-wider text-fluid-xs"
            style={{ marginBottom: fluidSizing.space.sm }}
          >
            {label} {required && '*'}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`flex-1 w-full bg-background-elevated border border-white/20 rounded-lg focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none text-text-primary font-rajdhani placeholder:text-text-muted ${className}`}
          style={{
            padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
            minHeight: minHeight || clamp('120px', '20vw', '180px'),
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

Textarea.displayName = 'Textarea';

export default Textarea;
