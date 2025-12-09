'use client';

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // En mobile, la sidebar empieza cerrada
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Proyectos', href: '/dashboard/projects', icon: 'projects' },
    { name: 'Skills', href: '/dashboard/skills', icon: 'skills' },
    { name: 'Mensajes', href: '/dashboard/messages', icon: 'messages' },
    { name: 'Newsletter', href: '/dashboard/newsletter', icon: 'newsletter' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: 'analytics' },
  ];

  return (
    <div className={`${isMobile ? 'relative' : 'flex'} h-viewport bg-admin-dark overflow-hidden`}>
      {/* Backdrop para mobile */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile && !sidebarOpen ? -256 : 0,
          width: isMobile ? 256 : (sidebarOpen ? 256 : 80)
        }}
        className={`bg-admin-dark-elevated border-r border-admin-primary/30 flex flex-col ${
          isMobile ? 'fixed left-0 top-0 bottom-0 z-50' : 'flex-shrink-0 relative'
        }`}
      >
        {/* Logo/Header */}
        <div className="border-b border-admin-primary/30 flex items-center" style={{ padding: fluidSizing.space.lg, justifyContent: sidebarOpen ? 'flex-start' : 'center', minHeight: '80px' }}>
          <Link href="/dashboard">
            <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: sidebarOpen ? fluidSizing.text['2xl'] : fluidSizing.text.xl }}>
              {sidebarOpen ? 'ADMIN' : 'A'}
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin" style={{ padding: fluidSizing.space.md, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xs }}>
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
                  padding: sidebarOpen ? `${fluidSizing.space.sm} ${fluidSizing.space.md}` : fluidSizing.space.md,
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  minHeight: '48px'
                }}
                title={!sidebarOpen ? item.name : undefined}
              >
                <Icon name={item.icon} size={sidebarOpen ? 20 : 24} />
                {sidebarOpen && (
                  <span className="font-medium" style={{ fontSize: fluidSizing.text.base }}>{item.name}</span>
                )}
                
                {/* Tooltip cuando está colapsado */}
                {!sidebarOpen && (
                  <div className="fixed left-[80px] px-3 py-2 bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg" style={{ marginLeft: '8px' }}>
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
            <div className="flex flex-col items-center" style={{ gap: fluidSizing.space.md }}>
              <div className="rounded-full bg-admin-primary/20 flex items-center justify-center text-admin-primary font-bold relative group" style={{ width: '40px', height: '40px', fontSize: fluidSizing.text.base }}>
                {user?.name?.[0]?.toUpperCase() || 'A'}
                
                {/* Tooltip usuario */}
                <div className="fixed left-[80px] px-3 py-2 bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg" style={{ marginLeft: '8px' }}>
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
                className="hover:bg-admin-error/10 text-admin-error rounded-lg transition-all duration-200 relative group flex items-center justify-center"
                style={{ padding: fluidSizing.space.sm, minWidth: '40px', minHeight: '40px' }}
                title="Cerrar sesión"
              >
                <Icon name="logout" size={20} />
                
                {/* Tooltip logout */}
                <div className="fixed left-[80px] px-3 py-2 bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg" style={{ marginLeft: '8px' }}>
                  <span className="text-sm font-medium text-text-primary">Cerrar sesión</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Toggle button - Solo en desktop */}
        {!isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 bg-admin-primary rounded-full flex items-center justify-center text-admin-dark hover:scale-110 transition-transform shadow-lg"
            style={{ top: fluidSizing.space['2xl'], width: fluidSizing.size.iconMd, height: fluidSizing.size.iconMd }}
          >
            <Icon name={sidebarOpen ? 'chevronLeft' : 'chevronRight'} size={14} />
          </button>
        )}
      </motion.aside>

      {/* Main content */}
      <main className={`flex flex-col flex-1 ${isMobile ? 'w-full h-full' : ''}`}>
        {/* Header para mobile */}
        {isMobile && (
          <header 
            className="flex-shrink-0 bg-admin-dark/80 backdrop-blur-md border-b border-admin-primary/20"
            style={{ 
              padding: fluidSizing.space.md,
              zIndex: 30
            }}
          >
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="bg-admin-dark-elevated/90 backdrop-blur-sm border border-admin-primary/30 rounded-lg flex items-center text-text-primary hover:border-admin-primary/50 hover:bg-admin-dark-elevated transition-all duration-200"
                style={{ 
                  padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`,
                  gap: fluidSizing.space.xs
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
                <span className="text-sm font-medium">Menú</span>
              </button>
            )}
          </header>
        )}
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <div className="max-w-7xl mx-auto" style={{ padding: isMobile ? fluidSizing.space.lg : fluidSizing.space['2xl'] }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
