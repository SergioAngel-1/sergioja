'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import StatCard from '@/components/molecules/StatCard';
import QuickActionCard from '@/components/molecules/QuickActionCard';
import Loader from '@/components/atoms/Loader';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <Loader fullScreen text="Cargando dashboard..." />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 cyber-grid opacity-5 -z-10" />
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-admin-primary text-glow-white mb-2">
            DASHBOARD
          </h1>
          <p className="text-text-muted text-sm md:text-base">
            Bienvenido de vuelta, <span className="text-text-primary font-medium">{user?.name || 'Admin'}</span>
          </p>
          <div className="h-0.5 w-20 bg-gradient-to-r from-admin-primary to-transparent mt-4" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Proyectos"
            value="0"
            icon="projects"
            delay={0.1}
            variant="accent"
          />
          <StatCard
            title="Mensajes"
            value="0"
            icon="messages"
            delay={0.2}
          />
          <StatCard
            title="Suscriptores"
            value="0"
            icon="users"
            delay={0.3}
          />
          <StatCard
            title="Visitas"
            value="0"
            icon="eye"
            delay={0.4}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-admin-primary/30 to-transparent" />
            <h2 className="text-xl md:text-2xl font-orbitron font-bold text-text-primary">
              ACCIONES RÁPIDAS
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-admin-primary/30 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Nuevo Proyecto"
              description="Crear un nuevo proyecto en el portafolio"
              icon="plus"
              href="/dashboard/projects/new"
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
            <QuickActionCard
              title="Configuración"
              description="Ajustes del sistema"
              icon="cpu"
              href="/dashboard/settings"
              delay={0.85}
            />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
