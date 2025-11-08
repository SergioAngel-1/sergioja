'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  
  // Lista de rutas válidas
  const validRoutes = ['/', '/projects', '/about', '/contact'];
  const isValidRoute = validRoutes.includes(pathname) || pathname.startsWith('/projects/');
  
  // Determinar si mostrar breadcrumbs o home badge según la ruta
  const showBreadcrumbs = pathname !== '/' && isValidRoute;
  const showHomeBadge = pathname === '/';

  return <Header showBreadcrumbs={showBreadcrumbs} showHomeBadge={showHomeBadge} />;
}
