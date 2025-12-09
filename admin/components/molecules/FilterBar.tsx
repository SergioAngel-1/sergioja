'use client';

import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import Select from './Select';

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
