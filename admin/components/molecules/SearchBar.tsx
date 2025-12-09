'use client';

import { useState } from 'react';
import Icon from '../atoms/Icon';
import { fluidSizing } from '@/lib/fluidSizing';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  icon?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Buscar...',
  icon = 'code',
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative flex-1">
      <div className="absolute top-1/2 -translate-y-1/2 text-text-muted flex items-center" style={{ left: fluidSizing.space.md }}>
        <Icon name={icon} size={18} />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="w-full bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
        style={{
          paddingLeft: `calc(${fluidSizing.space.md} + 18px + ${fluidSizing.space.sm})`,
          paddingRight: fluidSizing.space.md,
          paddingTop: fluidSizing.space.sm,
          paddingBottom: fluidSizing.space.sm,
          fontSize: fluidSizing.text.base,
        }}
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors flex items-center"
          style={{ right: fluidSizing.space.md }}
        >
          <Icon name="plus" size={16} className="rotate-45" />
        </button>
      )}
    </div>
  );
}
