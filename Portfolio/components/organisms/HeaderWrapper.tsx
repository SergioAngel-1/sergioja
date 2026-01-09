'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const [onTerminalOpen, setOnTerminalOpen] = useState<(() => void) | undefined>(undefined);
  
  // Lista de rutas válidas
  const validRoutes = ['/', '/projects', '/about', '/contact', '/faq', '/terms', '/privacy'];
  const isValidRoute = validRoutes.includes(pathname) || pathname.startsWith('/projects/');
  
  // Determinar si mostrar breadcrumbs o home badge según la ruta
  const showBreadcrumbs = pathname !== '/' && isValidRoute;
  const showHomeBadge = pathname === '/';
  const isHomePage = pathname === '/';

  // Listen for terminal handler registration from home page
  useEffect(() => {
    const handleTerminalRegister = (event: CustomEvent) => {
      setOnTerminalOpen(() => event.detail.handler);
    };

    window.addEventListener('register-terminal-handler' as any, handleTerminalRegister);

    return () => {
      window.removeEventListener('register-terminal-handler' as any, handleTerminalRegister);
      setOnTerminalOpen(undefined);
    };
  }, [pathname]);

  return <Header showBreadcrumbs={showBreadcrumbs} showHomeBadge={showHomeBadge} onTerminalOpen={onTerminalOpen} isHomePage={isHomePage} />;
}
