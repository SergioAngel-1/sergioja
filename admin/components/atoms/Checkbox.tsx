'use client';

import { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { fluidSizing } from '@/lib/fluidSizing';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  variant?: 'default' | 'card';
}

export default function Checkbox({
  label,
  description,
  variant = 'default',
  checked,
  className = '',
  ...props
}: CheckboxProps) {
  if (variant === 'card') {
    return (
      <label className={`flex items-start cursor-pointer group ${className}`}>
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <motion.div
            className={`
              rounded-lg border-2 transition-all duration-200 flex items-center justify-center
              ${checked
                ? 'bg-admin-primary/20 border-admin-primary'
                : 'bg-admin-dark-surface border-admin-primary/30 group-hover:border-admin-primary/50'
              }
            `}
            style={{ 
              width: fluidSizing.size.iconLg, 
              height: fluidSizing.size.iconLg 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={false}
              animate={{
                scale: checked ? 1 : 0,
                opacity: checked ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <Icon name="check" size={16} className="text-admin-primary" />
            </motion.div>
          </motion.div>
        </div>
        
        {(label || description) && (
          <div style={{ marginLeft: fluidSizing.space.sm }}>
            {label && (
              <span 
                className="text-text-primary font-medium block group-hover:text-admin-primary transition-colors" 
                style={{ fontSize: fluidSizing.text.base }}
              >
                {label}
              </span>
            )}
            {description && (
              <span 
                className="text-text-muted block" 
                style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }

  // Variant default (inline)
  return (
    <label className={`flex items-center cursor-pointer group ${className}`}>
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          className="sr-only peer"
          {...props}
        />
        <motion.div
          className={`
            rounded border-2 transition-all duration-200 flex items-center justify-center
            ${checked
              ? 'bg-admin-primary border-admin-primary'
              : 'bg-admin-dark-surface border-admin-primary/30 group-hover:border-admin-primary/50'
            }
          `}
          style={{ 
            width: fluidSizing.size.iconMd, 
            height: fluidSizing.size.iconMd 
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={false}
            animate={{
              scale: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon name="check" size={14} className="text-admin-dark" />
          </motion.div>
        </motion.div>
      </div>
      
      {label && (
        <span 
          className="text-text-primary font-medium group-hover:text-admin-primary transition-colors" 
          style={{ fontSize: fluidSizing.text.base, marginLeft: fluidSizing.space.sm }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
