'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProjectCard from '@/components/molecules/ProjectCard';
import FilterBar from '@/components/molecules/FilterBar';
import Icon from '@/components/atoms/Icon';
import Loader from '@/components/atoms/Loader';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image?: string | null;
  featured: boolean;
  demoUrl?: string | null;
  repoUrl?: string | null;
  publishedAt?: string | null;
  technologies?: { technology: { name: string; color: string } }[];
}

export default function ProjectsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterProjects();
  }, [projects, selectedCategory, selectedStatus, searchQuery]);

  const loadProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const response = await api.getProjects();
      
      if (response.success && response.data) {
        // Ensure data is an array
        const projectsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data as any).projects || [];
        
        setProjects(projectsData as Project[]);
        logger.info('Projects loaded successfully', { count: projectsData.length });
      } else {
        logger.error('Failed to load projects', response.error);
        setProjects([]);
      }
    } catch (error) {
      logger.error('Error loading projects', error);
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus === 'published') {
      filtered = filtered.filter((p) => p.publishedAt !== null);
    } else if (selectedStatus === 'draft') {
      filtered = filtered.filter((p) => p.publishedAt === null);
    } else if (selectedStatus === 'featured') {
      filtered = filtered.filter((p) => p.featured);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    setFilteredProjects(filtered);
  };

  if (isLoading || !isAuthenticated) {
    return <Loader fullScreen text="Cargando proyectos..." />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-admin-primary text-glow-white">
              PROYECTOS
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Gestiona tu portafolio de proyectos
            </p>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => router.push('/dashboard/projects/new')}
            className="flex items-center gap-2 px-6 py-3 bg-admin-primary text-admin-dark rounded-lg font-medium hover:bg-admin-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-admin-primary/20"
          >
            <Icon name="plus" size={20} />
            <span>Nuevo Proyecto</span>
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          <FilterBar
            onSearch={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <div className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg p-4">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total</p>
            <p className="text-2xl font-orbitron font-bold text-admin-primary">{projects.length}</p>
          </div>
          <div className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg p-4">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Publicados</p>
            <p className="text-2xl font-orbitron font-bold text-green-400">
              {projects.filter((p) => p.publishedAt).length}
            </p>
          </div>
          <div className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg p-4">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Borradores</p>
            <p className="text-2xl font-orbitron font-bold text-yellow-400">
              {projects.filter((p) => !p.publishedAt).length}
            </p>
          </div>
          <div className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg p-4">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Destacados</p>
            <p className="text-2xl font-orbitron font-bold text-red-400">
              {projects.filter((p) => p.featured).length}
            </p>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {isLoadingProjects ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Cargando proyectos..." />
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20 bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
          >
            <Icon name="projects" size={64} className="text-admin-primary/30 mb-4" />
            <p className="text-text-muted text-lg mb-2">No se encontraron proyectos</p>
            <p className="text-text-muted text-sm mb-6">
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Intenta ajustar los filtros'
                : 'Comienza creando tu primer proyecto'}
            </p>
            {!searchQuery && selectedCategory === 'all' && selectedStatus === 'all' && (
              <button
                onClick={() => router.push('/dashboard/projects/new')}
                className="flex items-center gap-2 px-6 py-3 bg-admin-primary text-admin-dark rounded-lg font-medium hover:bg-admin-primary/90 transition-all duration-200"
              >
                <Icon name="plus" size={20} />
                <span>Crear Proyecto</span>
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                category={project.category}
                image={project.image}
                featured={project.featured}
                demoUrl={project.demoUrl}
                repoUrl={project.repoUrl}
                publishedAt={project.publishedAt ? new Date(project.publishedAt) : null}
                technologies={project.technologies?.map((t) => ({
                  name: t.technology.name,
                  color: t.technology.color,
                }))}
                delay={index * 0.05}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
