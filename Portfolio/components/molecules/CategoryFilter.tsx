'use client';

import { motion } from 'framer-motion';
import MobileFilterDropdown from './MobileFilterDropdown';

export interface CategoryOption {
  value: string | undefined;
  label: string;
  count?: number;
}

interface CategoryFilterProps {
  categories: CategoryOption[];
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
  label?: string;
  showCount?: boolean;
  animationDelay?: number;
  className?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  label = 'Filter',
  showCount = false,
  animationDelay = 0.7,
  className = '',
}: CategoryFilterProps) {
  return (
    <div className={className}>
      {/* Mobile: Dropdown */}
      <div className="md:hidden">
        <MobileFilterDropdown
          options={categories.map((cat) => ({
            value: cat.value,
            label: showCount && cat.count !== undefined ? `${cat.label} (${cat.count})` : cat.label,
          }))}
          selectedValue={selectedCategory}
          onSelect={(value) => onCategoryChange(value)}
          label={label}
        />
      </div>

      {/* Desktop: Buttons */}
      <div className="hidden md:flex flex-wrap gap-3 md:gap-4">
        {categories.map((category, index) => {
          const isActive = selectedCategory === category.value;
          return (
            <motion.button
              key={category.value ?? 'all'}
              onClick={() => onCategoryChange(category.value)}
              className={`relative px-4 sm:px-5 md:px-6 py-2 md:py-2.5 rounded-lg font-rajdhani font-semibold text-xs sm:text-sm transition-all duration-300 overflow-hidden group ${
                isActive
                  ? 'bg-white/10 text-white border border-white/50 backdrop-blur-sm'
                  : 'bg-background-surface/50 text-text-secondary hover:text-text-primary border border-white/20 hover:border-white/50 hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDelay + index * 0.05 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-white/10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 uppercase tracking-wide flex items-center gap-2">
                {category.label}
                {showCount && category.count !== undefined && (
                  <span className="text-xs text-text-muted font-mono bg-background-elevated px-1.5 py-0.5 rounded">
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
