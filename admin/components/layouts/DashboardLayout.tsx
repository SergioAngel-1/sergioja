'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../atoms/Icon';
import { alerts } from '@/lib/alerts';
import { fluidSizing } from '@/lib/fluidSizing';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Proyectos', href: '/dashboard/projects', icon: 'projects' },
    { name: 'Skills', href: '/dashboard/skills', icon: 'skills' },
    { name: 'Mensajes', href: '/dashboard/messages', icon: 'messages' },
    { name: 'Newsletter', href: '/dashboard/newsletter', icon: 'newsletter' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: 'analytics' },
  ];

  return (
    <div className="flex h-viewport bg-admin-dark overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="bg-admin-dark-elevated border-r border-admin-primary/30 flex flex-col flex-shrink-0 relative"
      >
        {/* Logo/Header */}
        <div className="border-b border-admin-primary/30" style={{ padding: fluidSizing.space.lg }}>
          <Link href="/dashboard">
            <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: fluidSizing.text['2xl'] }}>
              {sidebarOpen ? 'ADMIN' : 'A'}
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin" style={{ padding: fluidSizing.space.md, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xs }}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-lg transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-admin-primary/20 text-admin-primary border border-admin-primary/50'
                    : 'text-text-secondary hover:bg-admin-dark-surface hover:text-text-primary'
                }`}
                style={{ 
                  gap: fluidSizing.space.sm, 
                  padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
                title={!sidebarOpen ? item.name : undefined}
              >
                <Icon name={item.icon} size={20} />
                {sidebarOpen && (
                  <span className="font-medium" style={{ fontSize: fluidSizing.text.base }}>{item.name}</span>
                )}
                
                {/* Tooltip cuando está colapsado */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                    <span className="text-sm font-medium text-text-primary">{item.name}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section - Compacto */}
        <div className="border-t border-admin-primary/30" style={{ padding: fluidSizing.space.md }}>
          {sidebarOpen ? (
            <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
              <div className="rounded-full bg-admin-primary/20 flex items-center justify-center text-admin-primary font-bold flex-shrink-0" style={{ width: fluidSizing.size.iconLg, height: fluidSizing.size.iconLg, fontSize: fluidSizing.text.sm }}>
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate" style={{ fontSize: fluidSizing.text.sm }}>
                  {user?.name || 'Admin'}
                </p>
                <p className="text-text-muted truncate" style={{ fontSize: fluidSizing.text.xs }}>
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => {
                  alerts.confirm(
                    '¿Cerrar sesión?',
                    '¿Estás seguro de que quieres cerrar tu sesión?',
                    async () => {
                      await logout();
                    },
                    undefined,
                    'Cerrar sesión',
                    'Cancelar'
                  );
                }}
                className="flex-shrink-0 hover:bg-admin-error/10 text-admin-error rounded-lg transition-all duration-200"
                style={{ padding: fluidSizing.space.xs }}
                title="Cerrar sesión"
              >
                <Icon name="logout" size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center" style={{ gap: fluidSizing.space.sm }}>
              <div className="rounded-full bg-admin-primary/20 flex items-center justify-center text-admin-primary font-bold relative group" style={{ width: fluidSizing.size.iconLg, height: fluidSizing.size.iconLg, fontSize: fluidSizing.text.sm }}>
                {user?.name?.[0]?.toUpperCase() || 'A'}
                
                {/* Tooltip usuario */}
                <div className="absolute left-full ml-2 px-3 py-2 bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                  <p className="text-sm font-medium text-text-primary">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-text-muted">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  alerts.confirm(
                    '¿Cerrar sesión?',
                    '¿Estás seguro de que quieres cerrar tu sesión?',
                    async () => {
                      await logout();
                    },
                    undefined,
                    'Cerrar sesión',
                    'Cancelar'
                  );
                }}
                className="hover:bg-admin-error/10 text-admin-error rounded-lg transition-all duration-200 relative group"
                style={{ padding: fluidSizing.space.xs }}
                title="Cerrar sesión"
              >
                <Icon name="logout" size={18} />
                
                {/* Tooltip logout */}
                <div className="absolute left-full ml-2 px-3 py-2 bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                  <span className="text-sm font-medium text-text-primary">Cerrar sesión</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 bg-admin-primary rounded-full flex items-center justify-center text-admin-dark hover:scale-110 transition-transform shadow-lg"
          style={{ top: fluidSizing.space['2xl'], width: fluidSizing.size.iconMd, height: fluidSizing.size.iconMd }}
        >
          <Icon name={sidebarOpen ? 'chevronLeft' : 'chevronRight'} size={14} />
        </button>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto" style={{ padding: fluidSizing.space['2xl'] }}>
          {children}
        </div>
      </main>
    </div>
  );
}
