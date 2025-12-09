'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Loader from '@/components/atoms/Loader';
import Icon from '@/components/atoms/Icon';
import TopItemCard from '@/components/molecules/TopItemCard';
import StatCard from '@/components/molecules/StatCard';
import TopSection from '@/components/molecules/TopSection';
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';

interface PageView {
  id: string;
  path: string;
  createdAt: string;
}

interface ProjectView {
  id: string;
  projectId: string;
  createdAt: string;
  project?: {
    title: string;
    slug: string;
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [projectViews, setProjectViews] = useState<ProjectView[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated, timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoadingData(true);
      const [pageViewsRes, projectViewsRes] = await Promise.all([
        api.getPageViews({ timeRange }),
        api.getProjectViews({ timeRange }),
      ]);

      if (pageViewsRes.success && pageViewsRes.data) {
        const data = Array.isArray(pageViewsRes.data)
          ? pageViewsRes.data
          : (pageViewsRes.data as any).pageViews || [];
        setPageViews(data);
      }

      if (projectViewsRes.success && projectViewsRes.data) {
        const data = Array.isArray(projectViewsRes.data)
          ? projectViewsRes.data
          : (projectViewsRes.data as any).projectViews || [];
        setProjectViews(data);
      }

      logger.info('Analytics loaded', {
        pageViews: pageViews.length,
        projectViews: projectViews.length,
      });
    } catch (error) {
      logger.error('Error loading analytics', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const stats = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const getLast7Days = (items: any[]) =>
      items.filter((item) => now - new Date(item.createdAt).getTime() < 7 * dayMs).length;

    const getLast30Days = (items: any[]) =>
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
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-admin-primary text-glow-white">
              ANALYTICS
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Estadísticas y métricas del portafolio
            </p>
          </div>

          <div className="flex gap-2">
            {(['7d', '30d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${timeRange === range
                    ? 'bg-admin-primary text-admin-dark'
                    : 'bg-admin-dark-surface text-text-secondary border border-admin-primary/20 hover:border-admin-primary/50 hover:text-text-primary'
                  }
                `}
              >
                {range === '7d' ? 'Últimos 7 días' : range === '30d' ? 'Últimos 30 días' : 'Todo'}
              </button>
            ))}
          </div>
        </motion.div>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Cargando datos..." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="bg-admin-dark-elevated border border-admin-primary/20 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon name="analytics" size={24} className="text-admin-primary" />
                <h3 className="text-lg font-orbitron font-bold text-admin-primary">
                  Resumen de Actividad
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
