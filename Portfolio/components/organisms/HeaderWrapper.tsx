'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  
  // Determinar si mostrar breadcrumbs o home badge según la ruta
  const showBreadcrumbs = pathname !== '/';
  const showHomeBadge = pathname === '/';

  return <Header showBreadcrumbs={showBreadcrumbs} showHomeBadge={showHomeBadge} />;
}
