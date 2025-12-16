import { useState, useEffect } from 'react';
import type { Profile } from '@/shared/types';
import { useLogger } from '@/shared/hooks/useLogger';

export default function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const log = useLogger('useProfile');

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        log.debug(`Fetching profile from ${apiUrl}/api/portfolio/profile`);
        
        const response = await fetch(`${apiUrl}/api/portfolio/profile`, {
          signal,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setProfile(data.data);
          log.info('Profile loaded successfully');
        } else {
          setError('Profile data not available');
          log.warn('Profile data not available in response');
        }
      } catch (error) {
        // Ignorar errores de abort (componente desmontado)
        if (error instanceof Error && error.name === 'AbortError') {
          log.debug('Profile fetch aborted (component unmounted)');
          return;
        }
        
        log.error('Error fetching profile', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        // Solo actualizar loading si no fue abortado
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    // Cleanup: abortar fetch si el componente se desmonta
    return () => {
      controller.abort();
    };
  }, [log]);

  return { profile, loading, error };
}
