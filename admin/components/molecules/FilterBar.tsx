'use client';

import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import Select from './Select';
import { fluidSizing } from '@/lib/fluidSizing';

interface FilterBarProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onEditCategories?: () => void;
  categories?: { value: string; label: string; count: number }[];
  selectedCategory?: string;
  selectedStatus?: string;
  searchPlaceholder?: string;
}

export default function FilterBar({
  onSearch,
  onCategoryChange,
  onStatusChange,
  onEditCategories,
  categories,
  selectedCategory = 'all',
  selectedStatus = 'all',
  searchPlaceholder = 'Buscar proyectos...',
}: FilterBarProps) {

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'published', label: 'Publicados' },
    { value: 'in_progress', label: 'En proceso' },
    { value: 'draft', label: 'Borradores' },
    { value: 'featured', label: 'Destacados' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
      {/* Search bar */}
      <SearchBar
        onSearch={onSearch}
        placeholder={searchPlaceholder}
        icon="code"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row" style={{ gap: fluidSizing.space.md }}>
        {/* Category filter */}
        {categories && categories.length > 0 && (
          <div className="flex-1">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              onEditCategories={onEditCategories}
            />
          </div>
        )}

        {/* Status filter */}
        <Select
          value={selectedStatus}
          onChange={onStatusChange}
          options={statusOptions}
          label="Estado"
          className={categories && categories.length > 0 ? 'sm:w-48' : 'flex-1'}
        />
      </div>
    </div>
  );
}
