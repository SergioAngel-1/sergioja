'use client';

import { useState } from 'react';
import Icon from '../atoms/Icon';

interface FilterBarProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  categories?: string[];
  selectedCategory?: string;
  selectedStatus?: string;
}

export default function FilterBar({
  onSearch,
  onCategoryChange,
  onStatusChange,
  categories = ['all', 'web', 'mobile', 'ai', 'backend', 'fullstack'],
  selectedCategory = 'all',
  selectedStatus = 'all',
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const categoryLabels: Record<string, string> = {
    all: 'Todos',
    web: 'Web',
    mobile: 'Mobile',
    ai: 'IA',
    backend: 'Backend',
    fullstack: 'Full Stack',
  };

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'published', label: 'Publicados' },
    { value: 'draft', label: 'Borradores' },
    { value: 'featured', label: 'Destacados' },
  ];

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
          <Icon name="code" size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Buscar proyectos..."
          className="w-full pl-12 pr-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              onSearch('');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            <Icon name="plus" size={16} className="rotate-45" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category filter */}
        <div className="flex-1">
          <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2">
            Categoría
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    selectedCategory === category
                      ? 'bg-admin-primary text-admin-dark border border-admin-primary'
                      : 'bg-admin-dark-surface text-text-secondary border border-admin-primary/20 hover:border-admin-primary/50 hover:text-text-primary'
                  }
                `}
              >
                {categoryLabels[category] || category}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div className="sm:w-48">
          <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2">
            Estado
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 cursor-pointer"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
