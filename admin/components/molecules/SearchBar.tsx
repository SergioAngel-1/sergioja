'use client';

import { useState } from 'react';
import Icon from '../atoms/Icon';

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
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
        <Icon name={icon} size={18} />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
        >
          <Icon name="plus" size={16} className="rotate-45" />
        </button>
      )}
    </div>
  );
}
