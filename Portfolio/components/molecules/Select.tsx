'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface SelectOption {
  value: string;
  label: string;
  count?: number;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  showCount?: boolean;
}

export default function Select({
  value,
  onChange,
  options,
  label,
  placeholder = 'Seleccionar...',
  className = '',
  showCount = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

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
          className="block text-text-muted font-mono uppercase tracking-wider mb-2"
          style={{ fontSize: fluidSizing.text.xs }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full
            bg-background-surface/50
            backdrop-blur-sm
            border border-white/30
            rounded-lg 
            text-left
            transition-all duration-300
            focus:outline-none 
            focus:border-white/50
            hover:border-white/40
            font-rajdhani
            ${isOpen ? 'border-white/50' : ''}
          `}
          style={{
            padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
            paddingRight: `calc(${fluidSizing.space.md} + 20px + ${fluidSizing.space.sm})`,
            fontSize: fluidSizing.text.base,
          }}
        >
          <span className={`whitespace-nowrap overflow-hidden text-ellipsis block ${selectedOption ? 'text-white' : 'text-white/50'}`}>
            {selectedOption ? (
              <>
                {selectedOption.label}
                {showCount && selectedOption.count !== undefined && (
                  <span className="text-white/60 ml-2">({selectedOption.count})</span>
                )}
              </>
            ) : placeholder}
          </span>
        </button>

        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none text-white/60 flex items-center transition-transform duration-200"
          style={{
            right: fluidSizing.space.md,
            transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full bg-background-surface/95 backdrop-blur-sm border border-white/30 rounded-lg shadow-2xl overflow-hidden"
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
                    w-full text-left transition-all duration-150 font-rajdhani
                    ${
                      option.value === value
                        ? 'bg-white/10 text-white border-l-2 border-white'
                        : 'text-white/80 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                    }
                  `}
                  style={{
                    padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
                    fontSize: fluidSizing.text.base,
                  }}
                >
                  {option.label}
                  {showCount && option.count !== undefined && (
                    <span className="text-white/60 ml-2">({option.count})</span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
