'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '../api-client';
import { logger } from '../logger';
import { cache, CacheTTL } from '../cache';

export interface ProjectCategory {
  name: string;
  label: string;
  active: boolean;
  color?: string;
  icon?: string;
}

interface UseProjectCategoriesOptions {
  useCache?: boolean;
}

export function useProjectCategories(options?: UseProjectCategoriesOptions) {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shouldUseCache = options?.useCache !== false;
  const cacheKey = 'project_categories:v2';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        logger.debug('Fetching project categories', 'useProjectCategories');
        const startTime = performance.now();
        
        let response;
        if (shouldUseCache) {
          response = await cache.fetchWithCache(
            cacheKey,
            () => api.getProjectCategories(),
            CacheTTL.TEN_MINUTES
          );
        } else {
          response = await api.getProjectCategories();
        }
        
        const duration = performance.now() - startTime;
        logger.performance('Project Categories Fetch', duration, 'ms');
        
        if (response.success && response.data) {
          const data = response.data as ProjectCategory[];
          // Filtrar solo categorías activas
          const activeCategories = data.filter(cat => cat.active);
          setCategories(activeCategories);
          logger.info(`Loaded ${activeCategories.length} active categories ${shouldUseCache ? '(cached)' : ''}`, 'useProjectCategories');
        } else {
          const errorMsg = response.error?.message || 'Failed to fetch categories';
          setError(errorMsg);
          logger.warn('Failed to fetch categories', response.error, 'useProjectCategories');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMsg);
        logger.error('Error fetching categories', err, 'useProjectCategories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [cacheKey, shouldUseCache]);

  return { categories, loading, error };
}
