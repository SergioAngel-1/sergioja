'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '../api-client';
import { logger } from '../logger';
import { cache, CacheTTL } from '../cache';
import type { Project, PaginatedResponse } from '@/shared/types';

interface UseProjectsOptions {
  tech?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  useCache?: boolean;
}

export function useProjects(options?: UseProjectsOptions) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Project>['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estabilizar referencia de options para evitar re-renders innecesarios
  const stableOptions = useMemo(() => options, [
    options?.tech,
    options?.category,
    options?.featured,
    options?.page,
    options?.limit,
    options?.useCache,
  ]);

  // Generar clave de caché única basada en las opciones
  const cacheKey = useMemo(() => {
    const params = {
      tech: stableOptions?.tech,
      category: stableOptions?.category,
      featured: stableOptions?.featured,
      page: stableOptions?.page,
      limit: stableOptions?.limit,
    };
    return `projects:${JSON.stringify(params)}`;
  }, [stableOptions?.tech, stableOptions?.category, stableOptions?.featured, stableOptions?.page, stableOptions?.limit]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        logger.debug('Fetching projects', stableOptions, 'useProjects');
        const startTime = performance.now();
        
        // Usar caché si está habilitado (por defecto true)
        const shouldUseCache = stableOptions?.useCache !== false;
        
        let response;
        if (shouldUseCache) {
          response = await cache.fetchWithCache(
            cacheKey,
            () => api.getProjects(stableOptions),
            CacheTTL.FIVE_MINUTES
          );
        } else {
          response = await api.getProjects(stableOptions);
        }
        
        const duration = performance.now() - startTime;
        logger.performance('Projects Fetch', duration, 'ms');
        
        if (response.success && response.data) {
          const data = response.data as PaginatedResponse<Project>;
          setProjects(data.data);
          setPagination(data.pagination);
          logger.info(`Loaded ${data.data.length} projects ${shouldUseCache ? '(cached)' : ''}`, 'useProjects');
        } else {
          const errorMsg = response.error?.message || 'Failed to fetch projects';
          setError(errorMsg);
          logger.warn('Failed to fetch projects', response.error, 'useProjects');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMsg);
        logger.error('Error fetching projects', err, 'useProjects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [cacheKey, stableOptions]);

  return { projects, pagination, loading, error };
}

export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        logger.debug(`Fetching project: ${slug}`, 'useProject');
        const response = await api.getProjectBySlug(slug);
        
        if (response.success && response.data) {
          setProject(response.data as Project);
          logger.info(`Loaded project: ${slug}`, 'useProject');
        } else {
          const errorMsg = response.error?.message || 'Project not found';
          setError(errorMsg);
          logger.warn(`Project not found: ${slug}`, response.error, 'useProject');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMsg);
        logger.error(`Error fetching project: ${slug}`, err, 'useProject');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  return { project, loading, error };
}
