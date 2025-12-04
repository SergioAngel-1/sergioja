'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-viewport bg-admin-dark">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-orbitron font-bold text-admin-primary text-glow-red">
            Dashboard
          </h1>
          <p className="text-text-secondary mt-2">
            Bienvenido, {user?.name || 'Admin'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Proyectos"
            value="0"
            icon="📊"
            color="red"
            delay={0.1}
          />
          <StatCard
            title="Mensajes"
            value="0"
            icon="✉️"
            color="blue"
            delay={0.2}
          />
          <StatCard
            title="Suscriptores"
            value="0"
            icon="👥"
            color="red"
            delay={0.3}
          />
          <StatCard
            title="Visitas"
            value="0"
            icon="👁️"
            color="blue"
            delay={0.4}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-admin-dark-elevated border border-admin-primary/30 rounded-lg p-6"
        >
          <h2 className="text-2xl font-orbitron font-bold text-text-primary mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionButton
              title="Nuevo Proyecto"
              icon="➕"
              href="/dashboard/projects/new"
            />
            <QuickActionButton
              title="Ver Mensajes"
              icon="📧"
              href="/dashboard/messages"
            />
            <QuickActionButton
              title="Gestionar Skills"
              icon="🛠️"
              href="/dashboard/skills"
            />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'red' | 'blue';
  delay: number;
}

function StatCard({ title, value, icon, color, delay }: StatCardProps) {
  const glowClass = color === 'red' ? 'glow-red' : 'glow-blue';
  const textGlowClass = color === 'red' ? 'text-glow-red' : 'text-glow-blue';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-admin-dark-elevated border border-admin-primary/30 rounded-lg p-6 ${glowClass}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm">{title}</p>
          <p className={`text-3xl font-orbitron font-bold mt-2 ${textGlowClass}`}>
            {value}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </motion.div>
  );
}

interface QuickActionButtonProps {
  title: string;
  icon: string;
  href: string;
}

function QuickActionButton({ title, icon, href }: QuickActionButtonProps) {
  return (
    <a
      href={href}
      className="bg-admin-dark-surface border border-admin-primary/30 rounded-lg p-4 hover:border-admin-primary hover:glow-red transition-all duration-200 flex items-center space-x-3"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-text-primary font-medium">{title}</span>
    </a>
  );
}
