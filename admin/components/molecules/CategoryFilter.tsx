'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileFilterDropdown from './MobileFilterDropdown';
import Icon from '../atoms/Icon';
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
  onEditCategories?: () => void;
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
  onEditCategories,
  label = 'Categoría',
  showCount = true,
  animationDelay = 0,
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
        key={category.value}
        onClick={() => {
          onCategoryChange(category.value);
          setShowMoreMenu(false);
        }}
        className={`relative rounded-lg font-medium transition-all duration-200 overflow-hidden group ${
          isActive
            ? 'bg-admin-primary text-admin-dark border border-admin-primary'
            : 'bg-admin-dark-surface text-text-secondary border border-admin-primary/20 hover:border-admin-primary/50 hover:text-text-primary'
        }`}
        style={{
          padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
          fontSize: fluidSizing.text.base,
          lineHeight: '1.5'
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
  };

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
      <div className="hidden md:flex flex-wrap items-center relative" style={{ gap: fluidSizing.space.sm }}>
        {/* Categorías visibles */}
        {visibleCategories.map((category, index) => renderCategoryButton(category, index))}
        
        {/* Botón "Más" con menú desplegable */}
        {hasHiddenCategories && (
          <div className="relative">
            <motion.button
              onMouseEnter={() => setShowMoreMenu(true)}
              onMouseLeave={() => setShowMoreMenu(false)}
              className="bg-admin-dark-surface text-text-secondary border border-admin-primary/20 hover:border-admin-primary/50 hover:text-text-primary rounded-lg transition-all duration-200 flex items-center justify-center"
              style={{
                padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
                fontSize: fluidSizing.text.base,
                lineHeight: '1.5',
                aspectRatio: '1'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDelay + visibleCategories.length * 0.05 }}
            >
              <Icon name="chevron-right" size={20} />
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
                  className="absolute top-full left-0 bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-2xl overflow-hidden z-50"
                  style={{ marginTop: fluidSizing.space.xs, minWidth: '200px' }}
                >
                  {hiddenCategories.map((category) => {
                    const isActive = selectedCategory === category.value;
                    return (
                      <button
                        key={category.value}
                        onClick={() => {
                          onCategoryChange(category.value);
                          setShowMoreMenu(false);
                        }}
                        className={`w-full text-left flex items-center justify-between transition-all duration-200 ${
                          isActive
                            ? 'bg-admin-primary/20 text-admin-primary'
                            : 'hover:bg-admin-primary/10 text-text-secondary hover:text-text-primary'
                        }`}
                        style={{ padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}` }}
                      >
                        <span className="uppercase tracking-wide font-medium" style={{ fontSize: fluidSizing.text.sm }}>
                          {category.label}
                        </span>
                        {showCount && (
                          <span
                            className={`rounded font-bold ${
                              isActive
                                ? 'bg-admin-primary/30 text-admin-primary'
                                : 'bg-admin-primary/10 text-text-muted'
                            }`}
                            style={{
                              padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                              fontSize: fluidSizing.text.xs
                            }}
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
        
        {/* Botón de editar categorías */}
        {onEditCategories && (
          <motion.button
            onClick={onEditCategories}
            className="bg-admin-dark-surface text-admin-primary border border-admin-primary/20 hover:border-admin-primary/50 hover:bg-admin-primary/10 rounded-lg transition-all duration-200 flex items-center justify-center"
            style={{
              padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
              fontSize: fluidSizing.text.base,
              lineHeight: '1.5',
              aspectRatio: '1'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: animationDelay + (visibleCategories.length + (hasHiddenCategories ? 1 : 0)) * 0.05 }}
            title="Editar categorías"
          >
            <Icon name="edit" size={20} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
