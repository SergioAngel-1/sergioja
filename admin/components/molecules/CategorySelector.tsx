'use client';

import { fluidSizing } from '@/lib/fluidSizing';

interface Category {
  name: string;
  label: string;
  active: boolean;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  label?: string;
  required?: boolean;
  isLoading?: boolean;
}

export default function CategorySelector({
  categories,
  selectedCategories,
  onChange,
  label = 'Categorías',
  required = false,
  isLoading = false,
}: CategorySelectorProps) {
  const handleToggle = (categoryName: string) => {
    const isSelected = selectedCategories.some(
      (c) => c?.toLowerCase() === categoryName.toLowerCase()
    );
    
    const updated = isSelected
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];
    
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs, marginBottom: fluidSizing.space.sm }}>
        {label} {required && '*'}
      </label>
      
      {isLoading || categories.length === 0 ? (
        <div className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-muted flex items-center justify-center" style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.sm }}>
          Cargando categorías...
        </div>
      ) : (
        <div className="flex flex-wrap" style={{ gap: fluidSizing.space.sm }}>
          {categories.filter(cat => cat.name && cat.label).map((cat) => {
            const isSelected = selectedCategories.some(
              (c) => c?.toLowerCase() === cat.name.toLowerCase() || c?.toLowerCase() === cat.label.toLowerCase()
            );
            
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleToggle(cat.name)}
                className={`rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'bg-admin-primary/20 border-admin-primary text-admin-primary'
                    : 'bg-admin-dark-surface border-admin-primary/20 text-text-muted hover:border-admin-primary/50'
                }`}
                style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.sm }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}
      
      {required && selectedCategories.length === 0 && (
        <p className="text-admin-warning" style={{ fontSize: fluidSizing.text.xs, marginTop: fluidSizing.space.xs }}>
          Selecciona al menos una categoría
        </p>
      )}
    </div>
  );
}
