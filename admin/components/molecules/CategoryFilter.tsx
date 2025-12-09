'use client';

interface CategoryFilterProps {
  categories: { value: string; label: string; count: number }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <label className="block text-text-muted text-xs font-medium uppercase tracking-wider">
        Categoría
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`
              group relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${
                selectedCategory === category.value
                  ? 'bg-admin-primary text-admin-dark border border-admin-primary'
                  : 'bg-admin-dark-surface text-text-secondary border border-admin-primary/20 hover:border-admin-primary/50 hover:text-text-primary'
              }
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              {category.label}
              <span
                className={`
                  px-1.5 py-0.5 rounded text-xs font-bold
                  ${
                    selectedCategory === category.value
                      ? 'bg-admin-dark/30 text-admin-primary'
                      : 'bg-admin-primary/10 text-text-muted group-hover:text-admin-primary'
                  }
                `}
              >
                {category.count}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
