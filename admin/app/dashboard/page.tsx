'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import StatCard from '@/components/molecules/StatCard';
import QuickActionCard from '@/components/molecules/QuickActionCard';
import { fluidSizing } from '@/lib/fluidSizing';
import { api } from '@/lib/api-client';
import { withAuth } from '@/lib/hoc';
import { DashboardStats } from '@/lib/types';

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    messages: 0,
    subscribers: 0,
    visits: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await api.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data as DashboardStats);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space['2xl'] }}>
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 cyber-grid opacity-5 -z-10" />
          <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: fluidSizing.text['5xl'], marginBottom: fluidSizing.space.sm }}>
            DASHBOARD
          </h1>
          <p className="text-text-muted" style={{ fontSize: fluidSizing.text.base }}>
            Bienvenido de vuelta, <span className="text-text-primary font-medium">{user?.name || 'Admin'}</span>
          </p>
          <div className="h-0.5 w-20 bg-gradient-to-r from-admin-primary to-transparent" style={{ marginTop: fluidSizing.space.md }} />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: fluidSizing.space.md }}>
          <StatCard
            title="Proyectos"
            value={isLoadingStats ? '...' : stats.projects.toString()}
            icon="projects"
            delay={0.1}
            variant="accent"
          />
          <StatCard
            title="Mensajes"
            value={isLoadingStats ? '...' : stats.messages.toString()}
            icon="messages"
            delay={0.2}
          />
          <StatCard
            title="Suscriptores"
            value={isLoadingStats ? '...' : stats.subscribers.toString()}
            icon="users"
            delay={0.3}
          />
          <StatCard
            title="Visitas"
            value={isLoadingStats ? '...' : stats.visits.toString()}
            icon="eye"
            delay={0.4}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}
        >
          <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-admin-primary/30 to-transparent" />
            <h2 className="font-orbitron font-bold text-text-primary" style={{ fontSize: fluidSizing.text['2xl'] }}>
              ACCIONES RÁPIDAS
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-admin-primary/30 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: fluidSizing.space.md }}>
            <QuickActionCard
              title="Nuevo Proyecto"
              description="Crear un nuevo proyecto en el portafolio"
              icon="plus"
              href="/dashboard/projects?new=true"
              delay={0.6}
            />
            <QuickActionCard
              title="Ver Mensajes"
              description="Revisar mensajes de contacto"
              icon="messages"
              href="/dashboard/messages"
              delay={0.65}
            />
            <QuickActionCard
              title="Gestionar Skills"
              description="Administrar habilidades y tecnologías"
              icon="skills"
              href="/dashboard/skills"
              delay={0.7}
            />
            <QuickActionCard
              title="Analytics"
              description="Ver estadísticas y métricas"
              icon="analytics"
              href="/dashboard/analytics"
              delay={0.75}
            />
            <QuickActionCard
              title="Newsletter"
              description="Gestionar suscriptores"
              icon="newsletter"
              href="/dashboard/newsletter"
              delay={0.8}
            />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(DashboardPage, { loadingText: 'Cargando dashboard...' });
