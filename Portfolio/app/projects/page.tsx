'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '@/lib/hooks/useProjects';
import { useLogger } from '@/shared/hooks/useLogger';
import { useProjectCategories } from '@/lib/hooks/useCategories';
import ProjectCard from '@/components/molecules/ProjectCard';
import PageHeader from '@/components/organisms/PageHeader';
import StatCard from '@/components/atoms/StatCard';
import Badge from '@/components/atoms/Badge';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import PageLoader from '@/components/molecules/PageLoader';
import Pagination from '@/components/molecules/Pagination';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { fluidSizing } from '@/lib/utils/fluidSizing';

export default function WorkPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8;
  const { projects, loading, error } = useProjects({ category: selectedCategory });
  const log = useLogger('WorkPage');
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset cuando cambia la categoría
  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset page when category changes
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: projects.length,
      featured: projects.filter(p => p.featured).length,
      categories: new Set(projects.map(p => p.category)).size,
    };
  }, [projects]);

  // Obtener categorías dinámicas desde los proyectos
  const categories = useProjectCategories(projects);

  // Pagination
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    return projects.slice(startIndex, startIndex + projectsPerPage);
  }, [projects, currentPage, projectsPerPage]);

  if (!mounted) {
    return (
      <div className="relative min-h-screen pl-0 md:pl-20 py-16 md:py-20 px-4 sm:px-6 md:px-8">
        <div className="absolute inset-0 cyber-grid opacity-10" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20 with-bottom-nav-inset">
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

        <div className="relative z-10 mx-auto w-full" style={{ maxWidth: '1600px', padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}`, paddingTop: `calc(${fluidSizing.header.height} + ${fluidSizing.space.md})` }}>
          {/* Header */}
          <div className="mb-8 md:mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              handleCategoryChange(category);
              log.interaction('filter_category', category || 'all');
            }}
            label={t('work.filter')}
            showCount={true}
            animationDelay={0.7}
          />
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
            className="text-center py-8 md:py-20"
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
            className="text-center py-8 md:py-20"
          >
            <div className="inline-block p-8 bg-background-surface/50 border border-white/30 rounded-lg">
              <svg className="w-16 h-16 text-white mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-text-secondary text-lg font-rajdhani">{t('work.noProjects')}</p>
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryChange(undefined)}
                  className="mt-4 px-6 py-2 bg-white/20 text-white border border-white/50 rounded-lg hover:bg-white/30 transition-all"
                >
                  {t('work.viewAll')}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {paginatedProjects.map((project, index) => (
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

        {/* Pagination */}
        {!loading && !error && projects.length > projectsPerPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 flex justify-center"
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        )}
        </div>
    </div>
  );
}
