'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '../api-client';
import { logger } from '../logger';
import { cache, CacheTTL } from '../cache';
import type { Skill } from '@/shared/types';

interface UseSkillsOptions {
  category?: string;
  useCache?: boolean;
}

export function useSkills(categoryOrOptions?: string | UseSkillsOptions) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Normalizar y estabilizar opciones
  const options = useMemo(() => {
    if (typeof categoryOrOptions === 'string') {
      return { category: categoryOrOptions, useCache: true };
    }
    return { useCache: true, ...categoryOrOptions };
  }, [
    typeof categoryOrOptions === 'string' ? categoryOrOptions : categoryOrOptions?.category,
    typeof categoryOrOptions === 'object' ? categoryOrOptions?.useCache : undefined,
  ]);

  const { category, useCache: shouldUseCache } = options;

  // Generar clave de caché única
  const cacheKey = useMemo(() => {
    return `skills:${category || 'all'}`;
  }, [category]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        
        logger.debug('Fetching skills', { category }, 'useSkills');
        const startTime = performance.now();
        
        let response;
        if (shouldUseCache) {
          response = await cache.fetchWithCache(
            cacheKey,
            () => api.getSkills(category),
            CacheTTL.TEN_MINUTES
          );
        } else {
          response = await api.getSkills(category);
        }
        
        const duration = performance.now() - startTime;
        logger.performance('Skills Fetch', duration, 'ms');
        
        if (response.success && response.data) {
          const skillsData = response.data as Skill[];
          setSkills(skillsData);
          logger.info(`Loaded ${skillsData.length} skills${category ? ` (category: ${category})` : ''} ${shouldUseCache ? '(cached)' : ''}`, undefined, 'useSkills');
        } else {
          const errorMsg = response.error?.message || 'Failed to fetch skills';
          setError(errorMsg);
          logger.warn('Failed to fetch skills', response.error, 'useSkills');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMsg);
        logger.error('Error fetching skills', err, 'useSkills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [cacheKey, category, shouldUseCache]);

  return { skills, loading, error };
}
