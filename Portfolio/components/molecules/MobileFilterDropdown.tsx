'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface FilterOption {
  value: string | undefined;
  label: string;
}

interface MobileFilterDropdownProps {
  options: FilterOption[];
  selectedValue: string | undefined;
  onSelect: (value: string | undefined) => void;
  label?: string;
}

export default function MobileFilterDropdown({
  options,
  selectedValue,
  onSelect,
  label = 'Filtrar',
}: MobileFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (value: string | undefined) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-background-surface/50 border border-white/30 rounded-lg text-text-primary hover:border-white/50 transition-all duration-300"
        style={{ gap: fluidSizing.space.sm, padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
      >
        <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
          <svg className="size-icon-sm text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-rajdhani font-semibold text-fluid-sm">
            {label}: <span className="text-white">{selectedOption?.label || 'Todos'}</span>
          </span>
        </div>
        <motion.svg
          className="size-icon-sm text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-background-elevated border border-white/30 rounded-lg shadow-2xl overflow-hidden z-50 max-h-[300px] overflow-y-auto"
              style={{ marginTop: fluidSizing.space.sm }}
            >
              {options.map((option, index) => {
                const isSelected = option.value === selectedValue;
                return (
                  <motion.button
                    key={option.value || 'all'}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-white/10 text-white border-l-2 border-cyber-red'
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    }`}
                    style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.md}` }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-rajdhani font-semibold uppercase text-fluid-sm">
                        {option.label}
                      </span>
                      {isSelected && (
                        <svg className="size-icon-sm text-cyber-red" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
