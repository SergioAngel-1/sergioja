'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLogger } from '@/shared/hooks/useLogger';
import PageHeader from '@/components/organisms/PageHeader';
import StatCard from '@/components/atoms/StatCard';
import Button from '@/components/atoms/Button';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import ExperienceCarousel from '@/components/molecules/ExperienceCarousel';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { trackDownload } from '@/lib/analytics';
import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';
import SkillCard from '@/components/molecules/SkillCard';
import type { Profile, Skill } from '@/shared/types';

interface TechnologyCategory {
  name: string;
  label: string;
  active: boolean;
  color?: string;
  icon?: string;
}

interface AboutContentProps {
  initialSkills: Skill[];
  initialProfile: Profile | null;
  initialCategories: TechnologyCategory[];
}

export default function AboutContent({ initialSkills, initialProfile, initialCategories }: AboutContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>('all');
  const [cvDownloaded, setCvDownloaded] = useState(false);
  const log = useLogger('AboutPage');
  const { t } = useLanguage();

  // Track scroll depth and time on page
  usePageAnalytics();

  // Memoizar agrupación de skills por categoría (solo recalcula cuando skills cambia)
  const skillsByCategory = useMemo(() => 
    initialSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof initialSkills>),
    [initialSkills]
  );

  // Crear mapa de colores y labels por categoría
  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    initialCategories.forEach(cat => {
      map[cat.name] = cat.color || '#ff0000';
    });
    return map;
  }, [initialCategories]);

  const categoryLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    initialCategories.forEach(cat => {
      map[cat.name] = cat.label;
    });
    return map;
  }, [initialCategories]);

  // Transformar categorías del backend al formato esperado por CategoryFilter
  const categories = useMemo(() => {
    const categoryOptions: Array<{ value: string | undefined; label: string; count?: number }> = [
      { value: 'all', label: t('about.all'), count: initialSkills.length },
    ];

    // Agregar categorías del backend con conteo de skills
    initialCategories.forEach(cat => {
      const count = initialSkills.filter(s => s.category === cat.name).length;
      if (count > 0) {
        categoryOptions.push({
          value: cat.name,
          label: cat.label,
          count,
        });
      }
    });

    return categoryOptions;
  }, [initialCategories, initialSkills, t]);

  // Memoizar skills filtradas por categoría
  const displayedSkills = useMemo(() => 
    selectedCategory === 'all' || !selectedCategory
      ? initialSkills 
      : skillsByCategory[selectedCategory] || [],
    [selectedCategory, initialSkills, skillsByCategory]
  );

  // Memoizar estadísticas (cálculos costosos)
  const stats = useMemo(() => {
    // Evitar división por cero
    const avgProficiency = initialSkills.length > 0
      ? Math.round(initialSkills.reduce((acc, s) => acc + s.proficiency, 0) / initialSkills.length)
      : 0;
    
    const totalExperience = initialSkills.length > 0
      ? Math.max(...initialSkills.map(s => s.yearsOfExperience || 0))
      : 0;

    return {
      totalSkills: initialSkills.length,
      avgProficiency,
      totalExperience,
      categories: Object.keys(skillsByCategory).length,
    };
  }, [initialSkills, skillsByCategory]);

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

                {/* Download CV Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  style={{ marginTop: fluidSizing.space.xl }}
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-white text-black border-white hover:bg-transparent hover:text-white"
                    onClick={async () => {
                      // Verificar si el perfil y el nombre de archivo CV existen
                      if (!initialProfile || !initialProfile.cvFileName) {
                        log.error('CV no disponible');
                        return;
                      }
                      
                      try {
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                        const response = await fetch(`${apiUrl}/api/portfolio/cv/${encodeURIComponent(initialProfile.cvFileName)}`);
                        if (!response.ok) throw new Error('Failed to download CV');
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = initialProfile.cvFileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                        trackDownload(initialProfile.cvFileName, 'pdf');
                        log.interaction('download_cv', 'cv_button');
                        
                        // Cambiar texto del botón
                        setCvDownloaded(true);
                        
                        // Resetear después de 3 segundos
                        setTimeout(() => {
                          setCvDownloaded(false);
                        }, 3000);
                      } catch (error) {
                        log.error('Error downloading CV', error);
                      }
                    }}
                    disabled={cvDownloaded}
                  >
                    {cvDownloaded ? t('about.cvDownloaded') : t('about.downloadCV')}
                  </Button>
                </motion.div>

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

          {/* Category filters (hidden when there are no skills or on error) */}
          {initialSkills.length > 0 && categories.length > 0 && (
            <div className="mb-6 md:mb-8">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(category) => {
                  setSelectedCategory(category || 'all');
                  log.interaction('filter_skill_category', category || 'all');
                }}
                label={t('about.filter')}
                showCount={true}
                animationDelay={1.5}
              />
            </div>
          )}

          {initialSkills.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 md:py-20"
            >
              <div className="inline-block p-8 bg-background-surface/50 border border-white/30 rounded-lg">
                <svg className="w-16 h-16 text-white mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-text-secondary text-lg font-rajdhani">{t('about.noSkills')}</p>
              </div>
            </motion.div>
          ) : selectedCategory === 'all' ? (
            // Vista por categorías cuando está en "all"
            <div className="space-y-8 md:space-y-10">
              {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any[]], catIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.05, duration: 0.2 }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-1 h-6 rounded-full" 
                        style={{ backgroundColor: categoryColorMap[category] || '#FF0000' }}
                      />
                      <h3 className="font-orbitron text-lg sm:text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                        {categoryLabelMap[category] || category}
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
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        delay={catIndex * 0.05 + index * 0.01}
                      />
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
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  delay={index * 0.01}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
