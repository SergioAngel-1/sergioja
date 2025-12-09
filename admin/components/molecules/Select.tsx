'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function Select({
  value,
  onChange,
  options,
  label,
  placeholder = 'Seleccionar...',
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={className} ref={selectRef}>
      {label && (
        <label
          className="block text-text-muted font-medium uppercase tracking-wider"
          style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Select Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full
            bg-admin-dark-surface
            border border-admin-primary/20 
            rounded-lg 
            text-left
            transition-all duration-200
            focus:outline-none 
            focus:border-admin-primary/50 
            focus:ring-2 
            focus:ring-admin-primary/20
            hover:border-admin-primary/40
            ${isOpen ? 'border-admin-primary/50 ring-2 ring-admin-primary/20' : ''}
          `}
          style={{
            padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
            paddingRight: fluidSizing.space['2xl'],
            fontSize: fluidSizing.text.base,
          }}
        >
          <span className={`whitespace-nowrap overflow-hidden text-ellipsis block ${selectedOption ? 'text-text-primary' : 'text-text-muted'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </button>

        {/* Dropdown Icon */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none text-text-muted flex items-center transition-transform duration-200"
          style={{
            right: fluidSizing.space.md,
            transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
          }}
        >
          <Icon name="chevronDown" size={18} />
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-2xl overflow-hidden"
              style={{
                marginTop: fluidSizing.space.xs,
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full text-left transition-all duration-150
                    ${
                      option.value === value
                        ? 'bg-admin-primary/20 text-admin-primary border-l-2 border-admin-primary'
                        : 'text-text-primary hover:bg-admin-primary/10 hover:text-admin-primary border-l-2 border-transparent'
                    }
                  `}
                  style={{
                    padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
                    fontSize: fluidSizing.text.base,
                  }}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
