'use client';

import Icon from '../atoms/Icon';
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
  onCreateNew?: () => void;
}

export default function CategorySelector({
  categories,
  selectedCategories,
  onChange,
  label = 'Categorías',
  required = false,
  isLoading = false,
  onCreateNew,
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: fluidSizing.space.sm }}>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs }}>
          {label} {required && '*'}
        </label>
        {onCreateNew && (
          <button
            type="button"
            onClick={onCreateNew}
            className="bg-admin-primary/20 hover:bg-admin-primary/30 text-admin-primary rounded-lg transition-all duration-200 flex items-center justify-center"
            style={{ padding: fluidSizing.space.sm, minWidth: fluidSizing.size.buttonMd }}
            title="Crear nueva categoría"
          >
            <Icon name="plus" size={20} />
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-muted flex items-center justify-center" style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.sm }}>
          Cargando categorías...
        </div>
      ) : categories.length === 0 ? (
        <div className="w-full bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-text-muted flex items-center justify-center" style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`, fontSize: fluidSizing.text.sm }}>
          No hay categorías disponibles
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
