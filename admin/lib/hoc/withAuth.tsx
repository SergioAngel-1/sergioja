'use client';

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Loader from '@/components/atoms/Loader';

interface WithAuthOptions {
  redirectTo?: string;
  loadingText?: string;
}

/**
 * HOC para proteger páginas que requieren autenticación
 * Elimina la lógica duplicada de verificación de auth en cada página
 * 
 * @example
 * export default withAuth(DashboardPage);
 * 
 * @example
 * export default withAuth(ProjectsPage, { 
 *   redirectTo: '/login',
 *   loadingText: 'Cargando proyectos...' 
 * });
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    redirectTo = '/login',
    loadingText = 'Verificando autenticación...',
  } = options;

  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) {
      return <Loader fullScreen text={loadingText} />;
    }

    return <Component {...props} />;
  };
}
