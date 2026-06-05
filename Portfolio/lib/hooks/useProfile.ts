import { useState, useEffect } from 'react';
import type { Profile } from '@/shared/types';
import { useLogger } from '@/shared/hooks/useLogger';
import { cache, CacheTTL } from '@/lib/cache';

interface UseProfileOptions {
  initialProfile?: Profile | null;
}

export default function useProfile(options?: UseProfileOptions) {
  const [profile, setProfile] = useState<Profile | null>(options?.initialProfile ?? null);
  const [loading, setLoading] = useState(!options?.initialProfile);
  const [error, setError] = useState<string | null>(null);
  const log = useLogger('useProfile');

  useEffect(() => {
    if (options?.initialProfile) {
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        log.debug('Fetching profile');

        const response = await cache.fetchWithCache(
          'useProfile:profile',
          async () => {
            const res = await fetch(`${apiUrl}/api/portfolio/profile`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          },
          CacheTTL.FIVE_MINUTES
        );

        if (cancelled) return;

        if (response.success) {
          setProfile(response.data);
          log.info('Profile loaded successfully');
        } else {
          setError('Profile data not available');
        }
      } catch (error) {
        if (!cancelled) {
          log.error('Error fetching profile', error);
          setError(error instanceof Error ? error.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [options?.initialProfile, log]);

  return { profile, loading, error };
}
