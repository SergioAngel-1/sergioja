'use client';

import { useState, ChangeEvent } from 'react';
import { fluidSizing } from '@/lib/utils/fluidSizing';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Buscar...',
  value: controlledValue,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onSearch(newValue);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="w-full bg-background-surface/50 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-all duration-300 font-rajdhani"
        style={{
          paddingLeft: `calc(${fluidSizing.space.md} + 20px + ${fluidSizing.space.sm})`,
          paddingRight: value ? `calc(${fluidSizing.space.md} + 20px + ${fluidSizing.space.sm})` : fluidSizing.space.md,
          paddingTop: fluidSizing.space.sm,
          paddingBottom: fluidSizing.space.sm,
          fontSize: fluidSizing.text.base,
        }}
      />
      <div className="absolute top-1/2 -translate-y-1/2 text-white/60 flex items-center pointer-events-none z-10" style={{ left: fluidSizing.space.md }}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {value && (
        <button
          onClick={handleClear}
          className="absolute top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors flex items-center"
          style={{ right: fluidSizing.space.md }}
          aria-label="Limpiar búsqueda"
        >
          <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}
