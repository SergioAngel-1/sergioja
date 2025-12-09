'use client';

import { motion } from 'framer-motion';
import MobileFilterDropdown from './MobileFilterDropdown';
import { fluidSizing } from '@/lib/fluidSizing';

export interface CategoryOption {
  value: string;
  label: string;
  count: number;
}

interface CategoryFilterProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  label?: string;
  showCount?: boolean;
  animationDelay?: number;
  className?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  label = 'Categoría',
  showCount = true,
  animationDelay = 0,
  className = '',
}: CategoryFilterProps) {
  return (
    <div className={className}>
      {/* Mobile: Dropdown */}
      <div className="md:hidden">
        <MobileFilterDropdown
          options={categories.map((cat) => ({
            value: cat.value,
            label: showCount ? `${cat.label} (${cat.count})` : cat.label,
          }))}
          selectedValue={selectedCategory}
          onSelect={(value) => onCategoryChange(value || 'all')}
          label={label}
        />
      </div>

      {/* Desktop: Buttons */}
      <div className="hidden md:block" style={{ marginBottom: fluidSizing.space.sm }}>
        <label className="block text-text-muted font-medium uppercase tracking-wider" style={{ fontSize: fluidSizing.text.xs }}>
          {label}
        </label>
      </div>
      <div className="hidden md:flex flex-wrap" style={{ gap: fluidSizing.space.sm }}>
        {categories.map((category, index) => {
          const isActive = selectedCategory === category.value;
          return (
            <motion.button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={`relative rounded-lg font-medium transition-all duration-200 overflow-hidden group ${
                isActive
                  ? 'bg-admin-primary text-admin-dark border border-admin-primary'
                  : 'bg-admin-dark-surface text-text-secondary border border-admin-primary/20 hover:border-admin-primary/50 hover:text-text-primary'
              }`}
              style={{
                padding: `${fluidSizing.space.xs} ${fluidSizing.space.md}`,
                fontSize: fluidSizing.text.sm
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDelay + index * 0.05 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-admin-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center uppercase tracking-wide" style={{ gap: fluidSizing.space.xs }}>
                {category.label}
                {showCount && (
                  <span
                    className={`rounded font-bold ${
                      isActive
                        ? 'bg-admin-dark/30 text-admin-primary'
                        : 'bg-admin-primary/10 text-text-muted group-hover:text-admin-primary'
                    }`}
                    style={{
                      padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                      fontSize: fluidSizing.text.xs
                    }}
                  >
                    {category.count}
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
