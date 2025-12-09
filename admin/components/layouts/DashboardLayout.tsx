'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../atoms/Icon';
import { alerts } from '@/lib/alerts';

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
        <div className="p-6 border-b border-admin-primary/30">
          <Link href="/dashboard">
            <h1 className="font-orbitron font-bold text-admin-primary text-glow-white text-2xl">
              {sidebarOpen ? 'ADMIN' : 'A'}
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-admin-primary/20 text-admin-primary border border-admin-primary/50'
                    : 'text-text-secondary hover:bg-admin-dark-surface hover:text-text-primary'
                }`}
              >
                <Icon name={item.icon} size={20} />
                {sidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section - Compacto */}
        <div className="p-4 border-t border-admin-primary/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-admin-primary/20 flex items-center justify-center text-admin-primary font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.email}
                </p>
              </div>
            )}
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
              className="flex-shrink-0 p-2 hover:bg-admin-error/10 text-admin-error rounded-lg transition-all duration-200"
              title="Cerrar sesión"
            >
              <Icon name="logout" size={18} />
            </button>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-admin-primary rounded-full flex items-center justify-center text-admin-dark hover:scale-110 transition-transform shadow-lg"
        >
          <Icon name={sidebarOpen ? 'chevronLeft' : 'chevronRight'} size={14} />
        </button>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
