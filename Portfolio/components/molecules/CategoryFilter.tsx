'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  maxVisible?: number; // Máximo de categorías visibles antes del menú
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  label = 'Filter',
  showCount = false,
  animationDelay = 0.7,
  className = '',
  maxVisible = 4,
}: CategoryFilterProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Dividir categorías en visibles y ocultas
  const visibleCategories = categories.slice(0, maxVisible);
  const hiddenCategories = categories.slice(maxVisible);
  const hasHiddenCategories = hiddenCategories.length > 0;

  const renderCategoryButton = (category: CategoryOption, index: number) => {
    const isActive = selectedCategory === category.value;
    return (
      <motion.button
        key={category.value ?? 'all'}
        onClick={() => {
          onCategoryChange(category.value);
          setShowMoreMenu(false);
        }}
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
  };

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
      <div className="hidden md:flex flex-wrap items-center gap-3 md:gap-4 relative">
        {/* Categorías visibles */}
        {visibleCategories.map((category, index) => renderCategoryButton(category, index))}
        
        {/* Botón "Más" con menú desplegable */}
        {hasHiddenCategories && (
          <div className="relative">
            <motion.button
              onMouseEnter={() => setShowMoreMenu(true)}
              onMouseLeave={() => setShowMoreMenu(false)}
              className="bg-background-surface/50 text-text-secondary border border-white/20 hover:border-white/50 hover:text-text-primary rounded-lg transition-all duration-300 flex items-center justify-center px-4 py-2 md:py-2.5 font-rajdhani font-semibold text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDelay + visibleCategories.length * 0.05 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {/* Menú desplegable */}
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setShowMoreMenu(true)}
                  onMouseLeave={() => setShowMoreMenu(false)}
                  className="absolute top-full left-0 mt-2 bg-background-elevated/95 backdrop-blur-sm border border-white/30 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[200px]"
                >
                  {hiddenCategories.map((category) => {
                    const isActive = selectedCategory === category.value;
                    return (
                      <button
                        key={category.value ?? 'hidden'}
                        onClick={() => {
                          onCategoryChange(category.value);
                          setShowMoreMenu(false);
                        }}
                        className={`w-full text-left flex items-center justify-between px-4 py-3 transition-all duration-200 font-rajdhani font-semibold text-xs sm:text-sm ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'hover:bg-white/10 text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <span className="uppercase tracking-wide">
                          {category.label}
                        </span>
                        {showCount && category.count !== undefined && (
                          <span
                            className={`text-xs font-mono rounded px-1.5 py-0.5 ${
                              isActive
                                ? 'bg-white/30 text-white'
                                : 'bg-white/10 text-text-muted'
                            }`}
                          >
                            {category.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
