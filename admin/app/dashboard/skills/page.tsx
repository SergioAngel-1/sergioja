'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loader from '@/components/atoms/Loader';
import Icon from '@/components/atoms/Icon';
import SkillCard from '@/components/molecules/SkillCard';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import StatCard from '@/components/molecules/StatCard';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';

interface Technology {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
  icon?: string | null;
  color: string;
  projects?: { projectId: string }[];
}

export default function SkillsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [skills, setSkills] = useState<Technology[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'proficiency' | 'projects'>('proficiency');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSkills();
    }
  }, [isAuthenticated]);

  const loadSkills = async () => {
    try {
      setIsLoadingSkills(true);
      const response = await api.getSkills();
      
      if (response.success && response.data) {
        const skillsData = Array.isArray(response.data)
          ? response.data
          : (response.data as any).technologies || [];
        
        setSkills(skillsData as Technology[]);
        logger.info('Skills loaded successfully', { count: skillsData.length });
      } else {
        logger.error('Failed to load skills', response.error);
        setSkills([]);
      }
    } catch (error) {
      logger.error('Error loading skills', error);
      setSkills([]);
    } finally {
      setIsLoadingSkills(false);
    }
  };

  // Filter and sort skills
  const filteredSkills = useMemo(() => {
    let filtered = [...skills];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((s) => s.name.toLowerCase().includes(query));
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'proficiency') {
        return b.proficiency - a.proficiency;
      } else if (sortBy === 'projects') {
        return (b.projects?.length || 0) - (a.projects?.length || 0);
      }
      return 0;
    });

    return filtered;
  }, [skills, selectedCategory, searchQuery, sortBy]);

  // Calculate category counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {
      all: skills.length,
      frontend: 0,
      backend: 0,
      devops: 0,
      design: 0,
      other: 0,
    };

    skills.forEach((skill) => {
      if (counts[skill.category] !== undefined) {
        counts[skill.category]++;
      } else {
        counts.other++;
      }
    });

    return [
      { value: 'all', label: 'Todas', count: counts.all },
      { value: 'frontend', label: 'Frontend', count: counts.frontend },
      { value: 'backend', label: 'Backend', count: counts.backend },
      { value: 'devops', label: 'DevOps', count: counts.devops },
      { value: 'design', label: 'Diseño', count: counts.design },
      { value: 'other', label: 'Otros', count: counts.other },
    ];
  }, [skills]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProjects = skills.reduce((sum, s) => sum + (s.projects?.length || 0), 0);
    const avgProficiency = skills.length > 0
      ? Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length)
      : 0;
    const avgExperience = skills.length > 0
      ? (skills.reduce((sum, s) => sum + s.yearsOfExperience, 0) / skills.length).toFixed(1)
      : '0';

    return {
      total: skills.length,
      totalProjects,
      avgProficiency,
      avgExperience,
    };
  }, [skills]);

  if (isLoading || !isAuthenticated) {
    return <Loader fullScreen text="Cargando skills..." />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-admin-primary text-glow-white">
            SKILLS & TECNOLOGÍAS
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Visualiza las tecnologías utilizadas en tus proyectos
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Total Skills"
            value={stats.total}
            variant="simple"
            delay={0.1}
          />
          <StatCard
            title="Proyectos"
            value={stats.totalProjects}
            color="blue-400"
            variant="simple"
            delay={0.15}
          />
          <StatCard
            title="Dominio Prom."
            value={`${stats.avgProficiency}%`}
            color="green-400"
            variant="simple"
            delay={0.2}
          />
          <StatCard
            title="Exp. Prom."
            value={`${stats.avgExperience} años`}
            color="yellow-400"
            variant="simple"
            delay={0.25}
          />
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-4"
        >
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Icon name="code" size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tecnologías..."
                className="w-full pl-12 pr-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200"
              />
            </div>

            {/* Sort */}
            <div className="sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-admin-primary/50 focus:ring-2 focus:ring-admin-primary/20 transition-all duration-200 cursor-pointer"
              >
                <option value="proficiency">Ordenar por Dominio</option>
                <option value="projects">Ordenar por Proyectos</option>
                <option value="name">Ordenar por Nombre</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>

        {/* Skills Grid */}
        {isLoadingSkills ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Cargando tecnologías..." />
          </div>
        ) : filteredSkills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
          >
            <Icon name="skills" size={64} className="text-admin-primary/30 mb-4" />
            <p className="text-text-muted text-lg mb-2">No se encontraron tecnologías</p>
            <p className="text-text-muted text-sm">
              {searchQuery || selectedCategory !== 'all'
                ? 'Intenta ajustar los filtros'
                : 'Las tecnologías se agregan automáticamente desde los proyectos'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, index) => (
              <SkillCard
                key={skill.id}
                name={skill.name}
                category={skill.category}
                proficiency={skill.proficiency}
                yearsOfExperience={skill.yearsOfExperience}
                color={skill.color}
                icon={skill.icon}
                projectCount={skill.projects?.length || 0}
                delay={index * 0.05}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
