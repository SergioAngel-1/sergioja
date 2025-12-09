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
import { api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { fluidSizing } from '@/lib/fluidSizing';

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

  const loadAnalytics = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const [pageViewsRes, projectViewsRes] = await Promise.all([
        api.getPageViews({ timeRange }),
        api.getProjectViews({ timeRange }),
      ]);

      if (pageViewsRes.success && pageViewsRes.data) {
        const data = Array.isArray(pageViewsRes.data)
          ? pageViewsRes.data
          : (pageViewsRes.data as { pageViews?: PageView[] }).pageViews || [];
        setPageViews(data);
      }

      if (projectViewsRes.success && projectViewsRes.data) {
        const data = Array.isArray(projectViewsRes.data)
          ? projectViewsRes.data
          : (projectViewsRes.data as { projectViews?: ProjectView[] }).projectViews || [];
        setProjectViews(data);
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
            <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: `clamp(1.75rem, 5vw, 2.5rem)` }}>
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
