'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loader from '@/components/atoms/Loader';
import Icon from '@/components/atoms/Icon';
import Button from '@/components/atoms/Button';
import StatCard from '@/components/molecules/StatCard';
import TopSection from '@/components/molecules/TopSection';
import Pagination from '@/components/atoms/Pagination';
import Select from '@/components/molecules/Select';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { clamp, fluidSizing } from '@/lib/fluidSizing';
import { PageView, ProjectView } from '@/lib/types';

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [projectViews, setProjectViews] = useState<ProjectView[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [selectedPath, setSelectedPath] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const loadAnalytics = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const [pageViewsRes, projectViewsRes] = await Promise.all([
        api.getPageViews({ timeRange }),
        api.getProjectViews({ timeRange }),
      ]);

      if (pageViewsRes.success && pageViewsRes.data) {
        // Handle new normalized structure
        const data = (pageViewsRes.data as any).pageViews || pageViewsRes.data;
        setPageViews(Array.isArray(data) ? data : []);
      }

      if (projectViewsRes.success && projectViewsRes.data) {
        // Handle new normalized structure
        const data = (projectViewsRes.data as any).projectViews || projectViewsRes.data;
        setProjectViews(Array.isArray(data) ? data : []);
      }

      logger.info('Analytics loaded successfully');
    } catch (error) {
      logger.error('Error loading analytics', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [timeRange]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated, loadAnalytics]);

  const stats = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const getLast7Days = (items: PageView[] | ProjectView[]) =>
      items.filter((item) => now - new Date(item.createdAt).getTime() < 7 * dayMs).length;

    const getLast30Days = (items: PageView[] | ProjectView[]) =>
      items.filter((item) => now - new Date(item.createdAt).getTime() < 30 * dayMs).length;

    const pageViewsLast7d = getLast7Days(pageViews);
    const pageViewsLast30d = getLast30Days(pageViews);
    const projectViewsLast7d = getLast7Days(projectViews);
    const projectViewsLast30d = getLast30Days(projectViews);

    return {
      totalPageViews: pageViews.length,
      totalProjectViews: projectViews.length,
      pageViewsLast7d,
      pageViewsLast30d,
      projectViewsLast7d,
      projectViewsLast30d,
    };
  }, [pageViews, projectViews]);

  const topPages = useMemo(() => {
    const pageCounts: Record<string, number> = {};
    pageViews.forEach((view) => {
      pageCounts[view.path] = (pageCounts[view.path] || 0) + 1;
    });

    return Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [pageViews]);

  // Filtrar page views por path seleccionado
  const filteredPageViews = useMemo(() => {
    if (!selectedPath || selectedPath === 'all') return pageViews;
    return pageViews.filter(view => view.path === selectedPath);
  }, [pageViews, selectedPath]);

  // Paginar page views
  const totalPages = Math.ceil(filteredPageViews.length / itemsPerPage);
  const paginatedPageViews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPageViews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPageViews, currentPage]);

  // Reset página cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPath, timeRange]);

  // Obtener paths únicos para el filtro
  const uniquePaths = useMemo(() => {
    const paths = Array.from(new Set(pageViews.map(view => view.path)));
    return paths.sort();
  }, [pageViews]);

  const topProjects = useMemo(() => {
    const projectCounts: Record<string, { title: string; count: number }> = {};
    projectViews.forEach((view) => {
      const title = view.project?.title || 'Unknown';
      if (!projectCounts[view.projectId]) {
        projectCounts[view.projectId] = { title, count: 0 };
      }
      projectCounts[view.projectId].count++;
    });

    return Object.values(projectCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [projectViews]);

  if (isLoading || !isAuthenticated) {
    return <Loader fullScreen text="Cargando analytics..." />;
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xl }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          style={{ gap: fluidSizing.space.md }}
        >
          <div className="flex-1">
            <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: clamp('1.75rem', '5vw', '2.5rem') }}>
              ANALYTICS
            </h1>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm, marginTop: fluidSizing.space.xs }}>
              Estadísticas y métricas del portafolio
            </p>
          </div>

          <div className="grid grid-cols-3 sm:flex w-full sm:w-auto" style={{ gap: fluidSizing.space.xs }}>
            {(['7d', '30d', 'all'] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? 'primary' : 'outline'}
                size="sm"
                className="text-xs sm:text-sm"
              >
                {range === '7d' ? '7d' : range === '30d' ? '30d' : 'Todo'}
              </Button>
            ))}
          </div>
        </motion.div>

        {isLoadingData ? (
          <div className="flex items-center justify-center" style={{ padding: `${fluidSizing.space['2xl']} 0` }}>
            <Loader size="lg" text="Cargando datos..." />
          </div>
        ) : pageViews.length === 0 && projectViews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg text-center"
            style={{ padding: fluidSizing.space['2xl'] }}
          >
            <div style={{ marginBottom: fluidSizing.space.lg }}>
              <Icon name="analytics" size={48} className="text-admin-primary/50 mx-auto" />
            </div>
            <h3 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text.xl, marginBottom: fluidSizing.space.sm }}>
              No hay datos de analytics
            </h3>
            <p className="text-text-muted" style={{ fontSize: fluidSizing.text.sm }}>
              Las métricas aparecerán cuando los usuarios visiten el portfolio.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: fluidSizing.space.md }}>
              <StatCard
                title="Vistas de Página"
                value={stats.totalPageViews.toLocaleString()}
                variant="simple"
                delay={0.1}
              />
              <StatCard
                title="Vistas de Proyectos"
                value={stats.totalProjectViews.toLocaleString()}
                variant="simple"
                delay={0.15}
              />
              <StatCard
                title="Últimos 7 días"
                value={stats.pageViewsLast7d.toLocaleString()}
                variant="simple"
                delay={0.2}
              />
              <StatCard
                title="Últimos 30 días"
                value={stats.pageViewsLast30d.toLocaleString()}
                variant="simple"
                delay={0.25}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: fluidSizing.space.lg }}>
              <TopSection
                title="Páginas Más Visitadas"
                subtitle="Top 5 por vistas"
                icon="eye"
                items={topPages.map(page => ({ title: page.path, count: page.count }))}
                totalCount={stats.totalPageViews}
                delay={0.3}
                itemColor="#60a5fa"
              />

              <TopSection
                title="Proyectos Más Vistos"
                subtitle="Top 5 por vistas"
                icon="projects"
                items={topProjects.map(project => ({ title: project.title, count: project.count }))}
                totalCount={stats.totalProjectViews}
                delay={0.35}
                itemColor="#34d399"
              />
            </div>

            {/* Filtro por path */}
            {uniquePaths.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
                style={{ padding: fluidSizing.space.lg }}
              >
                <div className="flex items-center justify-between flex-wrap" style={{ gap: fluidSizing.space.md }}>
                  <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
                    <Icon name="filter" size={20} className="text-admin-primary" />
                    <span className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text.base }}>
                      Filtrar por página
                    </span>
                  </div>
                  <div className="w-full sm:w-auto sm:min-w-[300px]">
                    <Select
                      value={selectedPath || 'all'}
                      onChange={(value) => setSelectedPath(value === 'all' ? undefined : value)}
                      options={[
                        { value: 'all', label: `Todas las páginas (${pageViews.length})` },
                        ...uniquePaths.map(path => ({
                          value: path,
                          label: `${path} (${pageViews.filter(v => v.path === path).length})`
                        }))
                      ]}
                      placeholder="Seleccionar página..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tabla de page views recientes */}
            {paginatedPageViews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg overflow-hidden"
              >
                <div className="flex items-center border-b border-admin-primary/20" style={{ padding: fluidSizing.space.lg, gap: fluidSizing.space.sm }}>
                  <Icon name="eye" size={24} className="text-admin-primary" />
                  <h3 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text.lg }}>
                    Vistas Recientes
                  </h3>
                  <span className="text-text-muted text-sm ml-auto">
                    {filteredPageViews.length} registro{filteredPageViews.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-admin-dark-surface">
                      <tr>
                        <th className="text-left text-admin-primary font-orbitron text-xs uppercase tracking-wider" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}>
                          Página
                        </th>
                        <th className="text-left text-admin-primary font-orbitron text-xs uppercase tracking-wider" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}>
                          Fecha
                        </th>
                        <th className="text-left text-admin-primary font-orbitron text-xs uppercase tracking-wider" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}>
                          Referrer
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPageViews.map((view, index) => (
                        <tr key={view.id} className="border-t border-admin-primary/10 hover:bg-admin-dark-surface/50 transition-colors">
                          <td className="text-text-primary font-mono text-sm" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}>
                            {view.path}
                          </td>
                          <td className="text-text-muted text-sm" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}>
                            {new Date(view.createdAt).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="text-text-muted text-xs truncate max-w-xs" style={{ padding: `${fluidSizing.space.md} ${fluidSizing.space.lg}` }}>
                            {view.referrer || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Paginación */}
            {filteredPageViews.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredPageViews.length}
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg"
              style={{ padding: fluidSizing.space.lg }}
            >
              <div className="flex items-center" style={{ gap: fluidSizing.space.sm, marginBottom: fluidSizing.space.md }}>
                <Icon name="analytics" size={24} className="text-admin-primary" />
                <h3 className="font-orbitron font-bold text-admin-primary" style={{ fontSize: fluidSizing.text.lg }}>
                  Resumen de Actividad
                </h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: fluidSizing.space.md }}>
                <StatCard
                  title="Vistas/Día (7d)"
                  value={stats.pageViewsLast7d > 0 ? Math.round(stats.pageViewsLast7d / 7) : 0}
                  color="blue-400"
                  variant="simple"
                  className="bg-admin-dark-surface border-admin-primary/10"
                  delay={0.45}
                />
                <StatCard
                  title="Vistas/Día (30d)"
                  value={stats.pageViewsLast30d > 0 ? Math.round(stats.pageViewsLast30d / 30) : 0}
                  color="green-400"
                  variant="simple"
                  className="bg-admin-dark-surface border-admin-primary/10"
                  delay={0.5}
                />
                <StatCard
                  title="Proyectos/Día (7d)"
                  value={stats.projectViewsLast7d > 0 ? Math.round(stats.projectViewsLast7d / 7) : 0}
                  color="yellow-400"
                  variant="simple"
                  className="bg-admin-dark-surface border-admin-primary/10"
                  delay={0.55}
                />
                <StatCard
                  title="Proyectos/Día (30d)"
                  value={stats.projectViewsLast30d > 0 ? Math.round(stats.projectViewsLast30d / 30) : 0}
                  color="purple-400"
                  variant="simple"
                  className="bg-admin-dark-surface border-admin-primary/10"
                  delay={0.6}
                />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
