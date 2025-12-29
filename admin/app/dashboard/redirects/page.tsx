'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Icon from '@/components/atoms/Icon';
import Loader from '@/components/atoms/Loader';
import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
import RedirectCreationTab from '@/components/molecules/RedirectCreationTab';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { fluidSizing } from '@/shared/fluidSizing';
import { withAuth } from '@/lib/hoc';
import { alerts } from '@/shared/alertSystem';

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
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const loadRedirects = async () => {
    try {
      setIsLoading(true);
      const response = await api.getRedirects();

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

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
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

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-admin-dark-bg text-text-primary"
        style={{ padding: fluidSizing.space.lg }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
              onClick={loadRedirects}
              variant="secondary"
              size="md"
              icon="refresh"
              disabled={isLoading}
            >
              Recargar
            </Button>
          </div>
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
        ) : (
          <>
            {deletedRedirects.length > 0 && (
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-text-primary font-semibold flex items-center gap-2">
                    <Icon name="trash" size={18} className="text-white" />
                    Redirecciones de proyectos eliminados ({deletedCount})
                  </h2>
                  <p className="text-text-muted text-xs">
                    Estas URLs apuntaban a proyectos eliminados y ahora redirigen al listado /projects.
                  </p>
                </div>
                <div className="grid gap-3">
                  {deletedRedirects.map((redirect) => (
                    <div
                      key={redirect.id}
                      className="bg-admin-dark-surface border border-white/10 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div>
                          <p className="text-text-muted text-xs mb-1">URL eliminada</p>
                          <code className="text-red-300 bg-red-500/10 px-2 py-1 rounded text-xs font-mono break-all">
                            /projects/{redirect.oldSlug}
                          </code>
                        </div>
                        <div>
                          <p className="text-text-muted text-xs mb-1">Redirige a</p>
                          <code className="text-green-300 bg-green-500/10 px-2 py-1 rounded text-xs font-mono">
                            /projects
                          </code>
                        </div>
                        <p className="text-text-muted text-xs">
                          Registrada el {formatDate(redirect.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => window.open(`/projects/${redirect.oldSlug}`, '_blank')}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/20 text-white text-sm hover:bg-white/10 transition-colors"
                        >
                          <Icon name="external-link" size={16} className="text-white" />
                          Ver URL vieja
                        </button>
                        <button
                          onClick={() => handleDelete(redirect.id, redirect.oldSlug)}
                          disabled={deletingId === redirect.id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Eliminar redirección"
                        >
                          {deletingId === redirect.id ? (
                            <Loader size="sm" />
                          ) : (
                            <Icon name="delete" size={fluidSizing.size.iconSm} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4">
              {groupedRedirects.map((group, groupIndex) => {
              const isExpanded = expandedProjects.has(group.project.id);

              return (
                <motion.div
                  key={group.project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.05 }}
                  className="bg-admin-dark-surface border border-admin-primary/20 rounded-lg overflow-hidden"
                >
                  {/* Project Header - Clickable */}
                  <button
                    onClick={() => toggleProject(group.project.id)}
                    className="w-full flex items-center justify-between bg-admin-dark-elevated hover:bg-admin-dark-elevated/80 transition-colors"
                    style={{ padding: fluidSizing.space.md }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-admin-primary/10 border border-admin-primary/30 rounded-lg">
                        <Icon
                          name={isExpanded ? 'chevron-down' : 'chevron-right'}
                          size={20}
                          className="text-admin-primary transition-transform"
                        />
                      </div>
                      <div className="text-left">
                        <h3
                          className="font-bold text-text-primary"
                          style={{ fontSize: fluidSizing.text.lg }}
                        >
                          {group.project.title}
                        </h3>
                        <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm }}>
                          URL actual:{' '}
                          <code className="text-admin-primary font-mono">
                            /projects/{group.project.slug}
                          </code>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className="font-bold text-white"
                          style={{ fontSize: fluidSizing.text.xl }}
                        >
                          {group.count}
                        </p>
                        <p className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>
                          {group.count === 1 ? 'redirección' : 'redirecciones'}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Redirects List - Collapsible */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-admin-primary/10"
                      >
                        <div className="divide-y divide-admin-primary/10">
                          {group.redirects.map((redirect, index) => (
                            <motion.div
                              key={redirect.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="grid grid-cols-12 gap-4 hover:bg-admin-dark-elevated/30 transition-colors"
                              style={{ padding: fluidSizing.space.md }}
                            >
                              {/* Old Slug */}
                              <div className="col-span-5">
                                <p className="text-text-muted text-xs mb-1">URL Antigua</p>
                                <code className="text-red-400 bg-red-500/10 px-2 py-1 rounded text-xs font-mono break-all">
                                  /projects/{redirect.oldSlug}
                                </code>
                              </div>

                              {/* New Slug */}
                              <div className="col-span-5">
                                <p className="text-text-muted text-xs mb-1">URL Nueva</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <code className="text-green-400 bg-green-500/10 px-2 py-1 rounded text-xs font-mono break-all">
                                    /projects/{redirect.newSlug}
                                  </code>
                                  {redirect.redirectType === 'DELETED_PROJECT' && (
                                    <span className="text-[0.65rem] uppercase tracking-wide bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 px-2 py-0.5 rounded-full">
                                      Eliminado · redirige al listado
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Date & Actions */}
                              <div className="col-span-2 flex flex-col items-end justify-between">
                                <p className="text-text-muted text-xs">
                                  {formatDate(redirect.createdAt)}
                                </p>
                                <button
                                  onClick={() =>
                                    handleDelete(redirect.id, redirect.oldSlug, group.project.id)
                                  }
                                  disabled={deletingId === redirect.id}
                                  className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
                                  title="Eliminar redirección"
                                >
                                  {deletingId === redirect.id ? (
                                    <Loader size="sm" />
                                  ) : (
                                    <Icon name="delete" size={fluidSizing.size.iconSm} />
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
              })}
            </div>
          </>
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
                variant="secondary"
                size="md"
                onClick={() => setShowCreateModal(false)}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="redirect-creation-form"
                variant="primary"
                size="md"
                disabled={isCreating}
              >
                {isCreating ? 'Creando...' : 'Crear Redirección'}
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
