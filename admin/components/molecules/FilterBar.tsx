'use client';

import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';

interface FilterBarProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  categories?: { value: string; label: string; count: number }[];
  selectedCategory?: string;
  selectedStatus?: string;
  searchPlaceholder?: string;
}

export default function FilterBar({
  onSearch,
  onCategoryChange,
  onStatusChange,
  categories,
  selectedCategory = 'all',
  selectedStatus = 'all',
  searchPlaceholder = 'Buscar proyectos...',
}: FilterBarProps) {

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'published', label: 'Publicados' },
    { value: 'draft', label: 'Borradores' },
    { value: 'featured', label: 'Destacados' },
  ];

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <SearchBar
        onSearch={onSearch}
        placeholder={searchPlaceholder}
        icon="code"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category filter */}
        {categories && categories.length > 0 && (
          <div className="flex-1">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />
          </div>
        )}

        {/* Status filter */}
        <div className={categories && categories.length > 0 ? 'sm:w-48' : 'flex-1'}>
          <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2">
            Estado
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 cursor-pointer"
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
