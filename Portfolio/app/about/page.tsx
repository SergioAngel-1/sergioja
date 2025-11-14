'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '@/lib/hooks/useSkills';
import { useLogger } from '@/lib/hooks/useLogger';
import PageHeader from '@/components/organisms/PageHeader';
import StatCard from '@/components/atoms/StatCard';
import Badge from '@/components/atoms/Badge';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import PageLoader from '@/components/molecules/PageLoader';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import ExperienceCarousel from '@/components/molecules/ExperienceCarousel';
import MobileFilterDropdown from '@/components/molecules/MobileFilterDropdown';
import { fluidSizing } from '@/lib/utils/fluidSizing';

export default function AboutPage() {
  const { skills, loading } = useSkills();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const log = useLogger('AboutPage');
  const { t } = useLanguage();

  // Memoizar agrupación de skills por categoría (solo recalcula cuando skills cambia)
  const skillsByCategory = useMemo(() => 
    skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof skills>),
    [skills]
  );

  // Memoizar lista de categorías
  const categories = useMemo(() => 
    ['all', ...Object.keys(skillsByCategory)],
    [skillsByCategory]
  );

  // Memoizar skills filtradas por categoría
  const displayedSkills = useMemo(() => 
    selectedCategory === 'all' 
      ? skills 
      : skillsByCategory[selectedCategory] || [],
    [selectedCategory, skills, skillsByCategory]
  );

  // Memoizar estadísticas (cálculos costosos)
  const stats = useMemo(() => {
    // Evitar división por cero
    const avgProficiency = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)
      : 0;
    
    const totalExperience = skills.length > 0
      ? Math.max(...skills.map(s => s.yearsOfExperience || 0))
      : 0;

    return {
      totalSkills: skills.length,
      avgProficiency,
      totalExperience,
      categories: Object.keys(skillsByCategory).length,
    };
  }, [skills, skillsByCategory]);

  return (
    <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20 with-bottom-nav-inset">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-10" />

      {/* Animated glow effects */}
      <GlowEffect
        color="white"
        size="lg"
        position={{ top: '10rem', right: '5rem' }}
        opacity={0.1}
        duration={4}
        animationType="pulse"
      />

      <GlowEffect
        color="white"
        size="lg"
        position={{ bottom: '10rem', left: '5rem' }}
        opacity={0.15}
        duration={3}
        delay={0.5}
        animationType="pulse"
      />

      {/* Floating particles - Reducidas en móvil */}
      <FloatingParticles count={50} color="bg-white" />

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: '1600px', padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}`, paddingTop: `calc(${fluidSizing.header.height} + ${fluidSizing.space.md})` }}>
        {/* Header */}
        <div className="mb-8 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] items-center gap-6 lg:gap-8 w-full">
            {/* Title and Description */}
            <PageHeader 
              title={t('about.title')} 
              subtitle={t('about.intro')} 
            />

            {/* Stats - 4 en línea horizontal */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-4 justify-self-end"
              style={{ gap: fluidSizing.space.sm }}
            >
              <StatCard label={t('about.skills')} value={stats.totalSkills} index={0} />
              <StatCard label={t('about.proficiency')} value={`${stats.avgProficiency}%`} index={1} />
              <StatCard label={t('about.yearsExp')} value={`${stats.totalExperience}+`} index={2} />
              <StatCard label={t('about.categories')} value={stats.categories} index={3} />
            </motion.div>
          </div>
        </div>

        {/* Bio section with visual elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{ marginBottom: fluidSizing.space['2xl'] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] xl:grid-cols-[7fr_3fr] overflow-x-clip" style={{ gap: fluidSizing.space.xl }}>
            {/* Left: Bio */}
            <div className="relative">
              <div className="bg-background-surface/50 backdrop-blur-sm border border-white/30 rounded-lg hover:border-white/50 transition-all duration-300" style={{ padding: fluidSizing.space.xl }}>
                <h2 className="font-orbitron font-bold text-white text-fluid-3xl" style={{ marginBottom: fluidSizing.space.lg }}>
                  {t('about.experience')}
                </h2>
                <div className="text-text-secondary font-rajdhani leading-relaxed text-fluid-base" style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
                  <p>
                    {t('about.bio1')} <span className="text-white font-semibold">{t('about.bio1b')}</span> {t('about.bio1c')}
                  </p>
                  <p>
                    {t('about.bio2')} <span className="text-white font-semibold">{t('about.bio2b')}</span> {t('about.bio2c')}
                  </p>
                  <p>
                    {t('about.bio3')} <span className="text-text-primary font-semibold">{t('about.bio3b')}</span>{t('about.bio3c')}
                  </p>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
              </div>
            </div>

            {/* Right: Experience Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="h-full w-full max-w-full min-w-0 overflow-hidden"
            >
              <ExperienceCarousel
                items={[
                  { label: t('about.automation'), value: t('about.automationValue'), icon: 'automation' },
                  { label: t('about.architecture'), value: t('about.architectureValue'), icon: 'architecture' },
                  { label: t('about.integration'), value: t('about.integrationValue'), icon: 'integration' },
                  { label: t('about.strategy'), value: t('about.strategyValue'), icon: 'strategy' },
                  { label: t('about.fullstack'), value: t('about.fullstackValue'), icon: 'fullstack' },
                ]}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Skills section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {t('about.skillsTitle')}
            </h2>
          </div>

          {/* Category filters */}
          {/* Mobile: Dropdown */}
          <div className="md:hidden mb-6">
            <MobileFilterDropdown
              options={categories.map((cat) => ({
                value: cat,
                label: cat === 'all' ? t('about.all') : cat,
              }))}
              selectedValue={selectedCategory}
              onSelect={(value) => {
                setSelectedCategory(value || 'all');
                log.interaction('filter_skill_category', value || 'all');
              }}
              label={t('about.filter')}
            />
          </div>

          {/* Desktop: Buttons */}
          <div className="hidden md:flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
            {categories.map((category, index) => {
              const isActive = selectedCategory === category;
              return (
                <motion.button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    log.interaction('filter_skill_category', category);
                  }}
                  className={`relative px-4 sm:px-5 py-2 rounded-lg font-rajdhani font-semibold text-xs sm:text-sm transition-all duration-300 overflow-hidden group ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/50'
                      : 'bg-background-surface/50 text-text-secondary hover:text-text-primary border border-white/20 hover:border-white/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.05 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSkillCategory"
                      className="absolute inset-0 bg-white/10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 uppercase text-sm">
                    {category === 'all' ? t('about.all') : category}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {loading ? (
            <PageLoader 
              variant="simple" 
              isLoading={loading} 
              message={t('about.loading')} 
            />
          ) : selectedCategory === 'all' ? (
            // Vista por categorías cuando está en "all"
            <div className="space-y-8 md:space-y-10">
              {Object.entries(skillsByCategory).map(([category, categorySkills], catIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.05, duration: 0.2 }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-cyber-red rounded-full" />
                      <h3 className="font-orbitron text-lg sm:text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                        {category}
                      </h3>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
                    <span className="text-xs text-text-muted font-mono bg-background-elevated px-2 py-1 rounded">
                      {categorySkills.length}
                    </span>
                  </div>

                  {/* Skills grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-2.5">
                    {categorySkills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: catIndex * 0.05 + index * 0.01, duration: 0.15 }}
                        className="group"
                      >
                        <div className="relative bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg p-2.5 sm:p-3 hover:border-white/50 transition-all duration-300">
                          {/* Skill name */}
                          <h4 className="font-orbitron text-xs font-bold text-white mb-1.5 truncate">
                            {skill.name}
                          </h4>

                          {/* Proficiency percentage */}
                          <div className="font-orbitron text-lg sm:text-xl font-bold text-white mb-1.5">
                            {skill.proficiency}%
                          </div>

                          {/* Progress bar */}
                          <div className="relative h-0.5 bg-background-elevated rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.proficiency}%` }}
                              transition={{ delay: catIndex * 0.05 + index * 0.01, duration: 0.4, ease: 'easeOut' }}
                              className="absolute h-full rounded-full bg-gradient-to-r from-cyber-red to-cyber-red/80"
                              style={{
                                boxShadow: '0 0 8px rgba(255, 0, 0, 0.5)',
                              }}
                            />
                          </div>

                          {/* Hover glow */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Vista normal cuando hay filtro específico
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-2.5"
            >
              {displayedSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01, duration: 0.15 }}
                  className="group"
                >
                  <div className="relative bg-background-surface/50 backdrop-blur-sm border border-white/20 rounded-lg p-2.5 sm:p-3 hover:border-white/50 transition-all duration-300">
                    {/* Skill name */}
                    <h4 className="font-orbitron text-xs font-bold text-white mb-1.5 truncate">
                      {skill.name}
                    </h4>

                    {/* Proficiency percentage */}
                    <div className="font-orbitron text-lg sm:text-xl font-bold text-white mb-1.5">
                      {skill.proficiency}%
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-1 bg-background-elevated rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                        transition={{ delay: index * 0.01, duration: 0.4, ease: 'easeOut' }}
                        className="absolute h-full rounded-full bg-gradient-to-r from-cyber-red to-cyber-red/80"
                        style={{
                          boxShadow: '0 0 8px rgba(255, 0, 0, 0.5)',
                        }}
                      />
                    </div>

                    {/* Hover glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-transparent opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-500"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
