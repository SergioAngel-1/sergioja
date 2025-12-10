'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../atoms/Icon';
import { alerts } from '@/lib/alerts';
import { fluidSizing } from '@/lib/fluidSizing';
import ChangePasswordModal from '../molecules/ChangePasswordModal';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  disabled?: boolean;
}

interface NavigationSection {
  type: 'single' | 'category';
  name: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  items?: NavigationItem[];
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

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

  // Cerrar settings dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };

    if (settingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsOpen]);

  const handleChangePassword = () => {
    setSettingsOpen(false);
    setIsChangePasswordModalOpen(true);
  };

  const navigation: NavigationSection[] = [
    {
      type: 'single',
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
    },
    {
      type: 'single',
      name: 'Blog',
      href: '#',
      icon: 'edit',
      disabled: true,
    },
    {
      type: 'category',
      name: 'Portafolio',
      items: [
        { name: 'Proyectos', href: '/dashboard/projects', icon: 'projects' },
        { name: 'Skills', href: '/dashboard/skills', icon: 'skills' },
      ],
    },
    {
      type: 'category',
      name: 'Comunicación',
      items: [
        { name: 'Mensajes', href: '/dashboard/messages', icon: 'messages' },
        { name: 'Newsletter', href: '/dashboard/newsletter', icon: 'newsletter' },
      ],
    },
    {
      type: 'category',
      name: 'Métricas',
      items: [
        { name: 'Analytics', href: '/dashboard/analytics', icon: 'analytics' },
        { name: 'Exportes', href: '#', icon: 'server', disabled: true },
      ],
    },
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
        style={isMobile ? {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
        } : undefined}
      >
        {/* Logo/Header */}
        <div className="border-b border-admin-primary/30 flex items-center" style={{ padding: fluidSizing.space.lg, justifyContent: sidebarOpen ? 'flex-start' : 'center', minHeight: fluidSizing.size.buttonLg }}>
          <Link href="/dashboard">
            <h1 className="font-orbitron font-bold text-admin-primary text-glow-white" style={{ fontSize: sidebarOpen ? fluidSizing.text['2xl'] : fluidSizing.text.xl }}>
              {sidebarOpen ? 'ADMIN' : 'A'}
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin" style={{ padding: fluidSizing.space.md, display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
          {navigation.map((section, sectionIndex) => {
            // Single item (Dashboard, Blog)
            if (section.type === 'single') {
              const isActive = pathname === section.href;
              const isDisabled = section.disabled ?? false;

              // Item deshabilitado
              if (isDisabled) {
                return (
                  <div
                    key={section.name}
                    className="flex items-center rounded-lg transition-all duration-200 relative group opacity-40 cursor-not-allowed text-text-secondary"
                    style={{
                      gap: fluidSizing.space.sm,
                      padding: sidebarOpen ? `${fluidSizing.space.sm} ${fluidSizing.space.md}` : fluidSizing.space.sm,
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      minHeight: fluidSizing.size.buttonMd
                    }}
                  >
                    <div style={{ width: sidebarOpen ? fluidSizing.size.iconSm : fluidSizing.size.iconMd, height: sidebarOpen ? fluidSizing.size.iconSm : fluidSizing.size.iconMd }}>
                      <Icon name={section.icon!} />
                    </div>
                    {sidebarOpen && (
                      <span className="font-medium" style={{ fontSize: fluidSizing.text.base }}>{section.name}</span>
                    )}
                    
                    {/* Tooltip "Próximamente" */}
                    <div className="fixed left-[80px] bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, marginLeft: fluidSizing.space.xs }}>
                      <span className="text-sm font-medium text-text-primary">Próximamente</span>
                    </div>
                  </div>
                );
              }

              // Item habilitado
              return (
                <Link
                  key={section.name}
                  href={section.href!}
                  className={`flex items-center rounded-lg transition-all duration-200 relative group ${
                    isActive
                      ? 'bg-admin-primary/20 text-admin-primary border border-admin-primary/50'
                      : 'text-text-secondary hover:bg-admin-dark-surface hover:text-text-primary'
                  }`}
                  style={{
                    gap: fluidSizing.space.sm,
                    padding: sidebarOpen ? `${fluidSizing.space.sm} ${fluidSizing.space.md}` : fluidSizing.space.sm,
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    minHeight: fluidSizing.size.buttonMd
                  }}
                >
                  <div style={{ width: sidebarOpen ? fluidSizing.size.iconSm : fluidSizing.size.iconMd, height: sidebarOpen ? fluidSizing.size.iconSm : fluidSizing.size.iconMd }}>
                    <Icon name={section.icon!} />
                  </div>
                  {sidebarOpen && (
                    <span className="font-medium" style={{ fontSize: fluidSizing.text.base }}>{section.name}</span>
                  )}
                  
                  {/* Tooltip cuando está colapsado */}
                  {!sidebarOpen && (
                    <div className="fixed left-[80px] bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, marginLeft: fluidSizing.space.xs }}>
                      <span className="text-sm font-medium text-text-primary">{section.name}</span>
                    </div>
                  )}
                </Link>
              );
            }

            // Category with items
            return (
              <div key={section.name} style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.xs }}>
                {/* Cuando está colapsado, mostrar solo un ícono representativo de la categoría */}
                {!sidebarOpen ? (
                  <>
                    {sectionIndex > 0 && (
                      <div className="border-t border-admin-primary/10" style={{ marginBottom: fluidSizing.space.xs }} />
                    )}
                    <Link
                      href={section.items?.[0]?.href || '#'}
                      onClick={() => setSidebarOpen(true)}
                      className="flex items-center rounded-lg transition-all duration-200 relative group text-text-secondary hover:bg-admin-dark-surface hover:text-text-primary"
                      style={{
                        gap: fluidSizing.space.sm,
                        padding: fluidSizing.space.sm,
                        justifyContent: 'center',
                        minHeight: fluidSizing.size.buttonMd
                      }}
                    >
                      <div style={{ width: fluidSizing.size.iconMd, height: fluidSizing.size.iconMd }}>
                        <Icon name={section.items?.[0]?.icon || 'dashboard'} />
                      </div>
                      
                      {/* Tooltip con nombre de categoría */}
                      <div className="fixed left-[80px] bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, marginLeft: fluidSizing.space.xs }}>
                        <span className="text-sm font-medium text-text-primary">{section.name}</span>
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Category label - solo visible cuando sidebar está abierto */}
                    <div 
                      className="text-text-muted uppercase tracking-wider font-medium"
                      style={{ 
                        fontSize: fluidSizing.text.xs,
                        paddingLeft: fluidSizing.space.sm,
                        paddingTop: sectionIndex === 0 ? '0' : fluidSizing.space.xs,
                      }}
                    >
                      {section.name}
                    </div>

                    {/* Category items */}
                    {section.items?.map((item) => {
                      const isActive = pathname === item.href;
                      const isDisabled = item.disabled ?? false;

                      if (isDisabled) {
                        return (
                          <div
                            key={item.name}
                            className="flex items-center rounded-lg transition-all duration-200 relative group opacity-40 cursor-not-allowed text-text-secondary"
                            style={{
                              gap: fluidSizing.space.sm,
                              padding: `${fluidSizing.space.sm} ${fluidSizing.space.md}`,
                              justifyContent: 'flex-start',
                              minHeight: fluidSizing.size.buttonSm,
                              marginLeft: fluidSizing.space.sm,
                            }}
                          >
                            <div style={{ width: fluidSizing.size.iconSm, height: fluidSizing.size.iconSm }}>
                              <Icon name={item.icon} />
                            </div>
                            <span className="font-medium" style={{ fontSize: fluidSizing.text.sm }}>{item.name}</span>
                            
                            {/* Tooltip "Próximamente" */}
                            <div className="fixed left-[80px] bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, marginLeft: fluidSizing.space.xs }}>
                              <span className="text-sm font-medium text-text-primary">Próximamente</span>
                            </div>
                          </div>
                        );
                      }

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
                            justifyContent: 'flex-start',
                            minHeight: fluidSizing.size.buttonSm,
                            marginLeft: fluidSizing.space.sm,
                          }}
                        >
                          <div style={{ width: fluidSizing.size.iconSm, height: fluidSizing.size.iconSm }}>
                            <Icon name={item.icon} />
                          </div>
                          <span className="font-medium" style={{ fontSize: fluidSizing.text.sm }}>{item.name}</span>
                        </Link>
                      );
                    })}
                  </>
                )}
              </div>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-admin-primary/30" style={{ padding: fluidSizing.space.md }}>
          {sidebarOpen ? (
            <div className="flex items-center justify-between" style={{ gap: fluidSizing.space.md }}>
              <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
                <div className="rounded-full bg-admin-primary/20 flex items-center justify-center text-admin-primary font-bold" style={{ width: '32px', height: '32px', fontSize: fluidSizing.text.sm }}>
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="text-text-primary font-medium" style={{ fontSize: fluidSizing.text.sm }}>{user?.name || 'Admin'}</span>
                  <span className="text-text-muted" style={{ fontSize: fluidSizing.text.xs }}>{user?.email}</span>
                </div>
              </div>
              
              <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
                {/* Botón de configuración */}
                <div className="relative" ref={settingsRef}>
                  <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="flex-shrink-0 hover:bg-admin-primary/10 text-text-primary rounded-lg transition-all duration-200"
                    style={{ padding: fluidSizing.space.xs }}
                  >
                    <Icon name="cpu" size={18} />
                  </button>

                  {/* Dropdown de configuración */}
                  <AnimatePresence>
                    {settingsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-0 mb-2 bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[200px]"
                      >
                        <button
                          onClick={handleChangePassword}
                          className="w-full text-left px-4 py-3 text-text-primary hover:bg-admin-primary/10 transition-colors duration-200 flex items-center"
                          style={{ gap: fluidSizing.space.sm, fontSize: fluidSizing.text.sm }}
                        >
                          <Icon name="plus" size={16} />
                          <span>Cambiar contraseña</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Botón de logout */}
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
                  className="flex-shrink-0 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                  style={{ padding: fluidSizing.space.xs, color: '#ff0000' }}
                >
                  <Icon name="logout" size={18} />
                </button>
              </div>
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
              
              {/* Botón de configuración */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="hover:bg-admin-primary/10 text-text-primary rounded-lg transition-all duration-200 relative group flex items-center justify-center"
                  style={{ padding: fluidSizing.space.sm, minWidth: '40px', minHeight: '40px' }}
                >
                  <Icon name="cpu" size={20} />
                  
                  {/* Tooltip configuración - solo visible cuando NO está abierto el dropdown */}
                  {!settingsOpen && (
                    <div className="absolute left-full bg-admin-dark-elevated border border-admin-primary/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg" style={{ padding: `${fluidSizing.space.xs} ${fluidSizing.space.sm}`, marginLeft: fluidSizing.space.sm, top: '50%', transform: 'translateY(-50%)' }}>
                      <span className="text-sm font-medium text-text-primary">Configuración</span>
                    </div>
                  )}
                </button>

                {/* Dropdown de configuración */}
                <AnimatePresence>
                  {settingsOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-full bg-admin-dark-elevated border border-admin-primary/30 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[200px]"
                      style={{ marginLeft: fluidSizing.space.sm, top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <button
                        onClick={handleChangePassword}
                        className="w-full text-left px-4 py-3 text-text-primary hover:bg-admin-primary/10 transition-colors duration-200 flex items-center"
                        style={{ gap: fluidSizing.space.sm, fontSize: fluidSizing.text.sm }}
                      >
                        <Icon name="plus" size={16} />
                        <span>Cambiar contraseña</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Botón de logout */}
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
                className="hover:bg-red-500/10 rounded-lg transition-all duration-200 relative group flex items-center justify-center"
                style={{ padding: fluidSizing.space.sm, minWidth: '40px', minHeight: '40px', color: '#ff0000' }}
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
              paddingTop: `calc(${fluidSizing.space.md} + env(safe-area-inset-top))`,
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

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
}
