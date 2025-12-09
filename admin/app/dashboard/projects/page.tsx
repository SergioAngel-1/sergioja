'use client';

import { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProjectCard from '@/components/molecules/ProjectCard';
import FilterBar from '@/components/molecules/FilterBar';
import StatCard from '@/components/molecules/StatCard';
import Icon from '@/components/atoms/Icon';
import Loader from '@/components/atoms/Loader';
import Button from '@/components/atoms/Button';
import ProjectFormModal from '@/components/molecules/ProjectFormModal';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { fluidSizing } from '@/lib/fluidSizing';

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

function ProjectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [existingSkills, setExistingSkills] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
      loadExistingSkills();
    }
  }, [isAuthenticated]);

  // Detectar query param para abrir modal de nuevo proyecto
  useEffect(() => {
    const shouldOpenModal = searchParams.get('new') === 'true';
    if (shouldOpenModal && isAuthenticated && !isLoadingProjects) {
      setIsModalOpen(true);
      // Limpiar el query param de la URL
      router.replace('/dashboard/projects');
    }
  }, [searchParams, isAuthenticated, isLoadingProjects, router]);

  const filterProjects = useCallback(() => {
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
  }, [projects, selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    filterProjects();
  }, [filterProjects]);

  const loadProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const response = await api.getProjects();
      
      if (response.success && response.data) {
        // El backend puede devolver { data: [...], pagination: {...} } o directamente [...]
        let projectsData: any[] = [];
        const responseData = response.data as any;
        
        if (Array.isArray(responseData)) {
          // Formato directo: { success: true, data: [...] }
          projectsData = responseData;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          // Formato anidado: { success: true, data: { data: [...], pagination: {...} } }
          projectsData = responseData.data;
        }
        
        console.log('Raw response:', response);
        console.log('Projects data:', projectsData);
        
        // Transformar las tecnologías del formato de Prisma al formato esperado
        const transformedProjects = projectsData.map((project: any) => ({
          ...project,
          // Extraer nombres de tecnologías de la relación ProjectTechnology
          technologies: project.technologies?.map((pt: any) => pt.technology?.name).filter(Boolean) || [],
          // Mantener también el array tech si existe
          tech: project.technologies?.map((pt: any) => pt.technology?.name).filter(Boolean) || project.tech || [],
        }));
        
        console.log('Transformed projects:', transformedProjects);
        
        setProjects(transformedProjects as Project[]);
        logger.info('Projects loaded successfully', { count: transformedProjects.length });
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

  const loadExistingSkills = async () => {
    try {
      const response = await api.getSkills();
      if (response.success && response.data) {
        const skillsData = Array.isArray(response.data) ? response.data : [];
        const skillNames = skillsData.map((skill: any) => skill.name);
        setExistingSkills(skillNames);
        logger.info('Skills loaded for autocomplete', { count: skillNames.length });
      }
    } catch (error) {
      logger.error('Error loading skills', error);
    }
  };

  // Calculate categories with counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {
      all: projects.length,
      web: 0,
      mobile: 0,
      ai: 0,
      backend: 0,
      fullstack: 0,
    };

    projects.forEach((project) => {
      if (counts[project.category] !== undefined) {
        counts[project.category]++;
      }
    });

    return [
      { value: 'all', label: 'Todos', count: counts.all },
      { value: 'web', label: 'Web', count: counts.web },
      { value: 'mobile', label: 'Mobile', count: counts.mobile },
      { value: 'ai', label: 'IA', count: counts.ai },
      { value: 'backend', label: 'Backend', count: counts.backend },
      { value: 'fullstack', label: 'Full Stack', count: counts.fullstack },
    ];
  }, [projects]);

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (projectData: Record<string, unknown>) => {
    try {
      if (selectedProject) {
        // Update existing project - usar slug
        const response = await api.updateProject(selectedProject.slug, projectData);
        if (response.success) {
          await loadProjects();
          setIsModalOpen(false);
          logger.info('Project updated successfully');
        }
      } else {
        // Create new project
        const response = await api.createProject(projectData);
        if (response.success) {
          await loadProjects();
          setIsModalOpen(false);
          logger.info('Project created successfully');
        }
      }
    } catch (error) {
      logger.error('Error saving project', error);
      throw error;
    }
  };

  if (isLoading || !isAuthenticated) {
    return <Loader fullScreen text="Cargando proyectos..." />;
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xl }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          style={{ gap: fluidSizing.space.md }}
        >
          <div className="flex-1">
            <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: `clamp(1.75rem, 5vw, 2.5rem)` }}>
              PROYECTOS
            </h1>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, marginTop: fluidSizing.space.xs }}>
              Gestiona tu portafolio de proyectos
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-full sm:w-auto"
          >
            <Button
              onClick={() => {
                setSelectedProject(null);
                setIsModalOpen(true);
              }}
              icon="plus"
              variant="primary"
              size="md"
              fullWidth
              className="sm:w-auto"
            >
              Nuevo Proyecto
            </Button>
          </motion.div>
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
            categories={categories}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            searchPlaceholder="Buscar proyectos..."
          />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: fluidSizing.space.md }}>
          <StatCard
            title="Total"
            value={projects.length}
            variant="simple"
            delay={0.2}
          />
          <StatCard
            title="Publicados"
            value={projects.filter((p) => p.publishedAt).length}
            color="green-400"
            variant="simple"
            delay={0.25}
          />
          <StatCard
            title="Borradores"
            value={projects.filter((p) => !p.publishedAt).length}
            color="yellow-400"
            variant="simple"
            delay={0.3}
          />
          <StatCard
            title="Destacados"
            value={projects.filter((p) => p.featured).length}
            color="red-400"
            variant="simple"
            delay={0.35}
          />
        </div>

        {/* Projects Grid */}
        {isLoadingProjects ? (
          <div className="flex items-center justify-center" style={{ padding: `${fluidSizing.space['2xl']} 0` }}>
            <Loader size="lg" text="Cargando proyectos..." />
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
            style={{ padding: fluidSizing.space['2xl'] }}
          >
            <div style={{ marginBottom: fluidSizing.space.md }}>
              <Icon name="projects" size={64} className="text-admin-primary/30" />
            </div>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.lg, marginBottom: fluidSizing.space.sm }}>No se encontraron proyectos</p>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, marginBottom: fluidSizing.space.lg }}>
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Intenta ajustar los filtros'
                : 'Comienza creando tu primer proyecto'}
            </p>
            {!searchQuery && selectedCategory === 'all' && selectedStatus === 'all' && (
              <Button
                onClick={() => {
                  setSelectedProject(null);
                  setIsModalOpen(true);
                }}
                icon="plus"
                variant="primary"
                size="md"
              >
                Crear Proyecto
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: fluidSizing.space.lg }}>
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
                onEdit={() => handleEditProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        project={selectedProject}
        existingSkills={existingSkills}
      />
    </DashboardLayout>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-text-primary">Cargando...</div></div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}
