'use client';

import { useState, useEffect, useCallback } from 'react';
import { cache, CacheTTL } from '../cache';

interface UseCacheOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  ttl?: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseCacheReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

/**
 * Hook para usar caché en componentes
 * 
 * @example
 * const { data, loading, error, refetch } = useCache({
 *   key: 'projects',
 *   fetcher: () => api.getProjects(),
 *   ttl: CacheTTL.FIVE_MINUTES,
 * });
 */
export function useCache<T>({
  key,
  fetcher,
  ttl = CacheTTL.FIVE_MINUTES,
  enabled = true,
  onSuccess,
  onError,
}: UseCacheOptions<T>): UseCacheReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Usar fetchWithCache del cache manager
      const result = await cache.fetchWithCache<T>(key, fetcher, ttl);
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, enabled, onSuccess, onError]);

  const clearCache = useCallback(() => {
    cache.delete(key);
    setData(null);
  }, [key]);

  const refetch = useCallback(async () => {
    clearCache();
    await fetchData();
  }, [clearCache, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
}

/**
 * Hook para invalidar caché de múltiples keys
 */
export function useCacheInvalidation() {
  const invalidate = useCallback((keys: string | string[]) => {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    keyArray.forEach(key => cache.delete(key));
  }, []);

  const invalidateAll = useCallback(() => {
    cache.clear();
  }, []);

  return {
    invalidate,
    invalidateAll,
  };
}
