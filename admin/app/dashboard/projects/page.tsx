'use client';

import { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProjectCard from '@/components/molecules/ProjectCard';
import FilterBar from '@/components/molecules/FilterBar';
import StatCard from '@/components/molecules/StatCard';
import Icon from '@/components/atoms/Icon';
import Loader from '@/components/atoms/Loader';
import Button from '@/components/atoms/Button';
import ProjectFormModal from '@/components/molecules/ProjectFormModal';
import CategoryManagementModal from '@/components/molecules/CategoryManagementModal';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { fluidSizing } from '@/lib/fluidSizing';
import { useCategories } from '@/lib/hooks';
import { withAuth } from '@/lib/hoc';
import { Project } from '@/lib/types';
import { alerts } from '@/shared/alertSystem';

function ProjectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [existingSkills, setExistingSkills] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Cargar categorías con hook personalizado
  const { categories: backendCategories, reload: reloadCategories } = useCategories('project', true);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoadingProjects(true);
      
      // Construir parámetros para filtros server-side
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: 20,
      };
      
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      const response = await api.getProjects(params);
      
      if (response.success && response.data) {
        const responseData = response.data as any;
        
        // Formato paginado: { data: [...], pagination: {...} }
        if (responseData.data && Array.isArray(responseData.data)) {
          setProjects(responseData.data as Project[]);
          
          if (responseData.pagination) {
            setTotalPages(responseData.pagination.totalPages || 1);
            setTotalProjects(responseData.pagination.total || 0);
          }
          
          logger.info('Projects loaded successfully', { 
            count: responseData.data.length, 
            page: currentPage,
            total: responseData.pagination?.total 
          });
        } else if (Array.isArray(responseData)) {
          // Fallback: formato directo sin paginación
          setProjects(responseData as Project[]);
          setTotalProjects(responseData.length);
          setTotalPages(1);
        }
      } else {
        logger.error('Failed to load projects', response.error);
        setProjects([]);
        setTotalProjects(0);
        setTotalPages(1);
      }
    } catch (error) {
      logger.error('Error loading projects', error);
      setProjects([]);
      setTotalProjects(0);
      setTotalPages(1);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [currentPage, selectedCategory, selectedStatus, searchQuery]);

  const loadExistingSkills = useCallback(async () => {
    try {
      const response = await api.getSkills();
      if (response.success && response.data) {
        const skillsData = Array.isArray(response.data) ? response.data : [];
        setExistingSkills(skillsData);
      }
    } catch (error) {
      logger.error('Error loading skills', error);
    }
  }, []);

  // Categorías se cargan automáticamente con useCategories

  useEffect(() => {
    loadProjects();
    loadExistingSkills();
  }, [loadProjects, loadExistingSkills]);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus, searchQuery]);

  // Detectar query param para abrir modal de nuevo proyecto
  useEffect(() => {
    const shouldOpenModal = searchParams.get('new') === 'true';
    if (shouldOpenModal && !isLoadingProjects) {
      setIsModalOpen(true);
      // Limpiar el query param de la URL
      router.replace('/dashboard/projects');
    }
  }, [searchParams, isLoadingProjects, router]);

  // Los proyectos ya vienen filtrados del backend, no necesitamos filtrado client-side
  const filteredProjects = projects;

  // Calculate categories combining backend categories (conteo aproximado de página actual)
  const categories = useMemo(() => {
    const categoryList = [
      { value: 'all', label: 'Todos', count: totalProjects }
    ];

    // Agregar categorías del backend
    backendCategories.forEach((backendCat) => {
      categoryList.push({
        value: backendCat.name,
        label: backendCat.label,
        count: 0 // El conteo exacto requeriría queries adicionales
      });
    });

    return categoryList;
  }, [totalProjects, backendCategories]);

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (projectData: Record<string, unknown>) => {
    try {
      if (selectedProject) {
        // Update existing project - usar ID estable
        const response = await api.updateProject(selectedProject.id, projectData);
        if (response.success) {
          await loadProjects();
          setIsModalOpen(false);
          logger.info('Project updated successfully');
        } else {
          // Show backend error to user
          const errorMessage = response.error?.message || 'Error al actualizar el proyecto';
          alerts.error('Error', errorMessage);
          logger.error('Failed to update project', response.error);
        }
      } else {
        // Create new project
        const response = await api.createProject(projectData);
        if (response.success) {
          await loadProjects();
          setIsModalOpen(false);
          logger.info('Project created successfully');
        } else {
          // Show backend error to user
          const errorMessage = response.error?.message || 'Error al crear el proyecto';
          alerts.error('Error', errorMessage);
          logger.error('Failed to create project', response.error);
        }
      }
    } catch (error) {
      logger.error('Error saving project', error);
      alerts.error('Error', 'Error inesperado al guardar el proyecto');
      throw error;
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    try {
      const response = await api.deleteProject(selectedProject.slug);
      if (response.success) {
        await loadProjects();
        setIsModalOpen(false);
        logger.info('Project deleted successfully');
      }
    } catch (error) {
      logger.error('Error deleting project', error);
      throw error;
    }
  };

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
            onEditCategories={() => setIsCategoryModalOpen(true)}
            categories={categories}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            searchPlaceholder="Buscar proyectos..."
          />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5" style={{ gap: fluidSizing.space.md }}>
          <StatCard
            title="Total"
            value={totalProjects}
            variant="simple"
            delay={0.2}
          />
          <StatCard
            title="Publicados"
            value={projects.filter((p) => p.status === 'PUBLISHED').length}
            color="green-400"
            variant="simple"
            delay={0.25}
          />
          <StatCard
            title="En proceso"
            value={projects.filter((p) => p.status === 'IN_PROGRESS').length}
            color="blue-400"
            variant="simple"
            delay={0.28}
          />
          <StatCard
            title="Borradores"
            value={projects.filter((p) => p.status === 'DRAFT').length}
            color="yellow-400"
            variant="simple"
            delay={0.3}
          />
          <StatCard
            title="Destacados"
            value={projects.filter((p) => p.isFeatured).length}
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
          <div className="flex flex-col" style={{ gap: fluidSizing.space.sm }}>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                longDescriptionEs={project.longDescriptionEs}
                longDescriptionEn={project.longDescriptionEn}
                category={project.categories[0] || 'web'}
                thumbnailImage={project.thumbnailImage}
                isFeatured={project.isFeatured}
                status={project.status}
                demoUrl={project.demoUrl}
                repoUrl={project.repoUrl}
                publishedAt={project.publishedAt && project.publishedAt.trim() !== '' ? new Date(project.publishedAt) : null}
                technologies={[]}
                delay={index * 0.05}
                onEdit={() => handleEditProject(project)}
              />
            ))}
          </div>
        )}

        {/* Paginación */}
        {!isLoadingProjects && filteredProjects.length > 0 && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-2"
            style={{ marginTop: fluidSizing.space.lg }}
          >
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="secondary"
              size="sm"
            >
              Anterior
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    variant={currentPage === pageNum ? 'primary' : 'secondary'}
                    size="sm"
                    className="min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="secondary"
              size="sm"
            >
              Siguiente
            </Button>
            
            <span className="text-text-muted text-sm ml-4">
              Página {currentPage} de {totalPages} ({totalProjects} proyectos)
            </span>
          </motion.div>
        )}
      </div>

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
        project={selectedProject}
        existingSkills={existingSkills}
      />

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          // Recargar categorías del backend
          reloadCategories();
          // Recargar proyectos para actualizar conteos
          loadProjects();
        }}
        type="project"
      />
    </DashboardLayout>
  );
}

const ProjectsPage = withAuth(function ProjectsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-text-primary">Cargando...</div></div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}, { loadingText: 'Cargando proyectos...' });

export default ProjectsPage;
