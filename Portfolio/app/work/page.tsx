'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '@/lib/hooks/useProjects';
import { useLogger } from '@/lib/hooks/useLogger';
import ProjectCard from '@/components/molecules/ProjectCard';
import ProjectCarousel from '@/components/molecules/ProjectCarousel';
import Header from '@/components/organisms/Header';
import PageHeader from '@/components/organisms/PageHeader';
import StatCard from '@/components/atoms/StatCard';
import Badge from '@/components/atoms/Badge';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import PageLoader from '@/components/molecules/PageLoader';
import Pagination from '@/components/molecules/Pagination';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import MobileFilterDropdown from '@/components/molecules/MobileFilterDropdown';
import { fluidSizing } from '@/lib/utils/fluidSizing';

export default function WorkPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const { projects, loading, error } = useProjects({ category: selectedCategory });
  const log = useLogger('WorkPage');
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset cuando cambia la categoría
  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: projects.length,
      featured: projects.filter(p => p.featured).length,
      categories: new Set(projects.map(p => p.category)).size,
    };
  }, [projects]);

  const categories = [
    { value: undefined, label: t('work.all') },
    { value: 'fullstack', label: t('work.fullstackCat') },
    { value: 'web', label: t('work.web') },
    { value: 'ai', label: t('work.ai') },
    { value: 'mobile', label: t('work.mobile') },
  ];

  if (!mounted) {
    return (
      <div className="relative min-h-screen pl-0 md:pl-20 py-16 md:py-20 px-4 sm:px-6 md:px-8">
        <div className="absolute inset-0 cyber-grid opacity-10" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <Header showBreadcrumbs />

      <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20">
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-10" />

        {/* Animated glow effects */}
        <GlowEffect
          color="white"
          size="lg"
          position={{ top: '5rem', right: '5rem' }}
          opacity={0.15}
          duration={3}
          animationType="pulse"
        />

        <GlowEffect
          color="white"
          size="lg"
          position={{ bottom: '5rem', left: '10rem' }}
          opacity={0.1}
          duration={4}
          delay={0.5}
          animationType="pulse"
        />

        {/* Floating particles - Reducidas en móvil */}
        <FloatingParticles count={50} color="bg-white" />

        <div className="relative z-10 mx-auto w-full" style={{ maxWidth: '1600px', padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}` }}>
          {/* Header */}
          <div className="mb-8 md:mb-16">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
              {/* Title and Description */}
              <PageHeader 
                title={t('work.title')} 
                subtitle={t('work.description')} 
              />

            {/* Stats - 3 columnas en el extremo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-3 lg:min-w-[240px]"
              style={{ gap: fluidSizing.space.sm }}
            >
              <StatCard label={t('work.total')} value={stats.total} index={0} />
              <StatCard label={t('work.featured')} value={stats.featured} index={1} />
              <StatCard label={t('work.categories')} value={stats.categories} index={2} />
            </motion.div>
          </div>
        </div>

        {/* Filters and View Controls */}
        {viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8 md:mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
              {/* Category filters - Mobile: Dropdown */}
              <div className="md:hidden">
                <MobileFilterDropdown
                  options={categories.map((cat) => ({
                    value: cat.value,
                    label: cat.label,
                  }))}
                  selectedValue={selectedCategory}
                  onSelect={(value) => {
                    handleCategoryChange(value);
                    log.interaction('filter_category', value || 'all');
                  }}
                  label={t('work.filter')}
                />
              </div>

            {/* Category filters - Desktop: Buttons */}
            <div className="hidden md:flex flex-wrap gap-3 md:gap-4">
              {categories.map((category, index) => {
                const isActive = selectedCategory === category.value;
                return (
                  <motion.button
                    key={category.label}
                    onClick={() => {
                      handleCategoryChange(category.value);
                      log.interaction('filter_category', category.label);
                    }}
                    className={`relative px-4 sm:px-5 md:px-6 py-2 md:py-2.5 rounded-lg font-rajdhani font-semibold text-xs sm:text-sm transition-all duration-300 overflow-hidden ${
                      isActive
                        ? 'bg-white/10 text-white border border-white/50 backdrop-blur-sm'
                        : 'bg-background-surface/50 text-text-secondary hover:text-text-primary border border-white/20 hover:border-white/50 hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                  >
                    <span className="relative z-10 uppercase tracking-wide">
                      {category.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
        )}

        {/* View mode toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8 md:mb-12 flex justify-end"
        >
          <div className="hidden md:flex gap-2 bg-background-surface/50 p-1 rounded-lg border border-white/20">
            {[
              { mode: 'carousel' as const, icon: 'M7 4v16M17 4v16M3 8h18M3 16h18', label: 'Carousel' },
              { mode: 'grid' as const, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', label: 'Grid' },
            ].map((view) => (
              <button
                key={view.mode}
                onClick={() => setViewMode(view.mode)}
                className={`p-2 rounded transition-all duration-300 ${
                  viewMode === view.mode
                    ? 'bg-white/10 text-white border border-white/50'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                title={view.label}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={view.icon} />
                </svg>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects display */}
        {loading ? (
          <PageLoader 
            variant="simple" 
            isLoading={loading} 
            message={t('work.loading')} 
          />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block p-6 bg-cyber-red/10 border border-cyber-red/30 rounded-lg">
              <svg className="w-12 h-12 text-cyber-red mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-cyber-red text-lg font-rajdhani">{error}</p>
            </div>
          </motion.div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-block p-8 bg-background-surface/50 border border-white/30 rounded-lg">
              <svg className="w-16 h-16 text-white mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-text-secondary text-lg font-rajdhani">{t('work.noProjects')}</p>
              <button
                onClick={() => handleCategoryChange(undefined)}
                className="mt-4 px-6 py-2 bg-white/20 text-white border border-white/50 rounded-lg hover:bg-white/30 transition-all"
              >
                {t('work.viewAll')}
              </button>
            </div>
          </motion.div>
        ) : viewMode === 'carousel' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <ProjectCarousel projects={projects} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ProjectCard project={project} viewMode="grid" />
              </motion.div>
            ))}
          </motion.div>
        )}
        </div>
      </div>
    </>
  );
}
