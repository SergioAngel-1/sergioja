'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Track scroll depth and time on page
  usePageAnalytics();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-viewport bg-admin-dark">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-primary"></div>
        <p className="mt-4 text-text-secondary">Cargando...</p>
      </div>
    </div>
  );
}
