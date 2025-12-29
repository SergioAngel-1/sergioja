'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/molecules/Modal';
import RedirectCreationTab from '@/components/molecules/RedirectCreationTab';
import RedirectGroupCard from '@/components/molecules/RedirectGroupCard';
import SearchBar from '@/components/molecules/SearchBar';
import { withAuth } from '@/lib/hoc/withAuth';
import { api } from '@/lib/api-client';
import { fluidSizing } from '@/lib/fluidSizing';
import { alerts } from '@/shared/alertSystem';
import { logger } from '@/lib/logger';

interface SlugRedirect {
  id: string;
  oldSlug: string;
  newSlug: string;
  createdAt: string;
  redirectType?: 'STANDARD' | 'DELETED_PROJECT';
}

interface DeletedRedirect {
  id: string;
  oldSlug: string;
  newSlug: string;
  createdAt: string;
  project?: {
    id: string;
    title: string;
    slug: string;
  };
  redirectType: 'DELETED_PROJECT';
}

interface ProjectGroup {
  project: {
    id: string;
    title: string;
    slug: string;
  };
  redirects: SlugRedirect[];
  count: number;
}

interface RedirectsResponse {
  grouped: ProjectGroup[];
  deleted: DeletedRedirect[];
  total: number;
  projectsAffected: number;
  deletedCount?: number;
}

function RedirectsPageContent() {
  const [groupedRedirects, setGroupedRedirects] = useState<ProjectGroup[]>([]);
  const [totalRedirects, setTotalRedirects] = useState(0);
  const [projectsAffected, setProjectsAffected] = useState(0);
  const [deletedRedirects, setDeletedRedirects] = useState<DeletedRedirect[]>([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadRedirects = async (skipCache = false) => {
    try {
      setIsLoading(true);
      const response = await api.getRedirects({ skipCache });

      if (response.success && response.data) {
        const data = response.data as RedirectsResponse;
        
        // Validar que los datos tengan la estructura esperada
        if (data.grouped && Array.isArray(data.grouped)) {
          setGroupedRedirects(data.grouped);
          setDeletedRedirects(data.deleted || []);
          setDeletedCount(data.deletedCount ?? (data.deleted?.length ?? 0));
          setTotalRedirects(data.total || 0);
          setProjectsAffected(data.projectsAffected || 0);
          logger.info('Redirects loaded', { 
            total: data.total,
            projects: data.projectsAffected,
            deleted: data.deletedCount,
          });
        } else {
          // Si no tiene la estructura esperada, inicializar con valores vacíos
          setGroupedRedirects([]);
          setDeletedRedirects([]);
          setDeletedCount(0);
          setTotalRedirects(0);
          setProjectsAffected(0);
          logger.warn('Redirects data has unexpected structure', data);
        }
      } else {
        setGroupedRedirects([]);
        setDeletedRedirects([]);
        setDeletedCount(0);
        setTotalRedirects(0);
        setProjectsAffected(0);
        alerts.error('Error', 'No se pudieron cargar las redirecciones');
      }
    } catch (error) {
      setGroupedRedirects([]);
      setDeletedRedirects([]);
      setDeletedCount(0);
      setTotalRedirects(0);
      setProjectsAffected(0);
      logger.error('Error loading redirects', error);
      alerts.error('Error', 'Error al cargar las redirecciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRedirects();
  }, []);

  const handleDelete = (id: string, oldSlug: string, projectId?: string) => {
    alerts.confirm(
      'Eliminar redirección',
      `¿Eliminar la redirección de "${oldSlug}"? Esto puede causar errores 404 si hay enlaces apuntando a esta URL.`,
      async () => {
        try {
          setDeletingId(id);
          const response = await api.deleteRedirect(id);
          
          if (response.success) {
            alerts.success('Eliminada', 'Redirección eliminada correctamente');
            
            // Actualizar el estado eliminando el redirect del grupo
            if (projectId) {
              setGroupedRedirects((prev) => {
                return prev
                  .map((group) => {
                    if (group.project.id === projectId) {
                      const updatedRedirects = group.redirects.filter((r) => r.id !== id);
                      return {
                        ...group,
                        redirects: updatedRedirects,
                        count: updatedRedirects.length,
                      };
                    }
                    return group;
                  })
                  .filter((group) => group.count > 0); // Eliminar grupos vacíos
              });
            } else {
              setDeletedRedirects((prev) => prev.filter((redirect) => redirect.id !== id));
              setDeletedCount((prev) => Math.max(0, prev - 1));
            }

            setTotalRedirects((prev) => Math.max(0, prev - 1));
            logger.info('Redirect deleted', { id, oldSlug });
          } else {
            alerts.error('Error', response.error?.message || 'No se pudo eliminar la redirección');
          }
        } catch (error) {
          logger.error('Error deleting redirect', error);
          alerts.error('Error', 'Error al eliminar la redirección');
        } finally {
          setDeletingId(null);
        }
      },
      undefined,
      'Eliminar',
      'Cancelar'
    );
  };

  const handleCreateRedirect = async (payload: { oldSlug: string; newSlug: string; notes?: string }) => {
    try {
      setIsCreating(true);
      const response = await api.createRedirect(payload);
      
      if (response.success) {
        alerts.success('Creada', 'Redirección manual creada correctamente');
        logger.info('Manual redirect created', payload);
        setShowCreateModal(false);
        await loadRedirects();
      } else {
        alerts.error('Error', response.error?.message || 'No se pudo crear la redirección');
      }
    } catch (error) {
      logger.error('Error creating redirect', error);
      alerts.error('Error', 'Error al crear la redirección');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Group redirects by newSlug for better UX
  const groupRedirectsByDestination = (redirects: SlugRedirect[]) => {
    const grouped = new Map<string, SlugRedirect[]>();
    
    redirects.forEach((redirect) => {
      const existing = grouped.get(redirect.newSlug) || [];
      existing.push(redirect);
      grouped.set(redirect.newSlug, existing);
    });
    
    // Convert to array and flatten for display
    return Array.from(grouped.entries()).map(([newSlug, oldRedirects]) => ({
      newSlug,
      oldSlugs: oldRedirects.map(r => r.oldSlug),
      redirects: oldRedirects,
      // Use the most recent createdAt
      createdAt: oldRedirects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0].createdAt,
    }));
  };

  // Filter redirects based on search query
  const filteredGroupedRedirects = groupedRedirects.filter((group) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Search by project title
    if (group.project.title.toLowerCase().includes(query)) return true;
    
    // Search by project slug
    if (group.project.slug.toLowerCase().includes(query)) return true;
    
    // Search by any redirect oldSlug or newSlug
    return group.redirects.some(
      (redirect) =>
        redirect.oldSlug.toLowerCase().includes(query) ||
        redirect.newSlug.toLowerCase().includes(query)
    );
  }).map(group => ({
    ...group,
    groupedRedirects: groupRedirectsByDestination(group.redirects),
  }));

  const filteredDeletedRedirects = deletedRedirects.filter((redirect) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      redirect.oldSlug.toLowerCase().includes(query) ||
      redirect.newSlug.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-admin-dark-bg text-text-primary"
        style={{ padding: fluidSizing.space.lg }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="font-bold text-text-primary"
                style={{ fontSize: fluidSizing.text['3xl'], marginBottom: fluidSizing.space.xs }}
              >
                Redirecciones SEO
              </h1>
              <p className="text-text-muted" style={{ fontSize: fluidSizing.text.base }}>
                Gestiona las redirecciones 301 automáticas y manuales para campañas y Google Ads
              </p>
            </div>
            <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="primary"
                size="md"
                icon="plus"
                disabled={isLoading}
              >
                Crear Manual
              </Button>
              <Button
                onClick={() => loadRedirects(true)}
                variant="secondary"
                size="md"
                icon="refresh"
                disabled={isLoading}
              >
                Recargar
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Buscar por proyecto o URL..."
            icon="search"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg flex items-center justify-center"
            style={{ padding: fluidSizing.space.md }}
          >
            <div className="text-center">
              <p className="text-white mb-2" style={{ fontSize: fluidSizing.text.xs }}>
                Total Redirecciones
              </p>
              <p className="font-bold text-white" style={{ fontSize: fluidSizing.text['2xl'] }}>
                {totalRedirects}
              </p>
            </div>
          </div>

          <div
            className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg flex items-center justify-center"
            style={{ padding: fluidSizing.space.md }}
          >
            <div className="text-center">
              <p className="text-white mb-2" style={{ fontSize: fluidSizing.text.xs }}>
                Proyectos Afectados
              </p>
              <p className="font-bold text-white" style={{ fontSize: fluidSizing.text['2xl'] }}>
                {projectsAffected}
              </p>
            </div>
          </div>

          <div
            className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg flex items-center justify-center"
            style={{ padding: fluidSizing.space.md }}
          >
            <div className="text-center">
              <p className="text-white mb-2" style={{ fontSize: fluidSizing.text.xs }}>
                Estado
              </p>
              <p className="font-bold text-white" style={{ fontSize: fluidSizing.text.lg }}>
                Activas
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : groupedRedirects.length === 0 && deletedRedirects.length === 0 ? (
          <div
            className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-center"
            style={{ padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}` }}
          >
            <Icon
              name="link"
              size={fluidSizing.size.iconLg}
              className="text-text-muted mx-auto mb-4"
            />
            <h3
              className="font-semibold text-text-primary mb-2"
              style={{ fontSize: fluidSizing.text.xl }}
            >
              No hay redirecciones
            </h3>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.base }}>
              Las redirecciones se crean automáticamente cuando cambias el título de un proyecto
            </p>
          </div>
        ) : filteredGroupedRedirects.length === 0 && filteredDeletedRedirects.length === 0 ? (
          <div
            className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg text-center"
            style={{ padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}` }}
          >
            <Icon
              name="search"
              size={fluidSizing.size.iconLg}
              className="text-text-muted mx-auto mb-4"
            />
            <h3
              className="font-semibold text-text-primary mb-2"
              style={{ fontSize: fluidSizing.text.xl }}
            >
              No se encontraron resultados
            </h3>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.base }}>
              Intenta con otro término de búsqueda
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Project Redirects */}
            {filteredGroupedRedirects.map((group) => (
              <RedirectGroupCard
                key={group.project.id}
                title={group.project.title}
                subtitle={`URL actual: /projects/${group.project.slug}`}
                icon="projects"
                redirectCount={group.count}
                redirects={group.groupedRedirects}
                onDelete={(redirectId, oldSlug) => handleDelete(redirectId, oldSlug, group.project.id)}
                deletingId={deletingId}
                variant="default"
              />
            ))}

            {/* Deleted Projects Redirects */}
            {filteredDeletedRedirects.length > 0 && (
              <RedirectGroupCard
                title="Proyectos Eliminados"
                subtitle="Redirigen al listado /projects"
                icon="trash"
                redirectCount={filteredDeletedRedirects.length}
                redirects={filteredDeletedRedirects}
                onDelete={(redirectId, oldSlug) => handleDelete(redirectId, oldSlug)}
                deletingId={deletingId}
                variant="deleted"
              />
            )}
          </div>
        )}

        {/* Modal para crear redirección manual */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Crear Redirección Manual"
          maxWidth="2xl"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                disabled={isCreating}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="redirect-creation-form"
                variant="primary"
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating ? 'Creando...' : 'Crear redirección'}
              </Button>
            </>
          }
        >
          <div style={{ padding: fluidSizing.space.lg }}>
            <RedirectCreationTab
              onSubmit={handleCreateRedirect}
              isSubmitting={isCreating}
              formId="redirect-creation-form"
            />
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

const RedirectsPage = withAuth(RedirectsPageContent);
export default RedirectsPage;
