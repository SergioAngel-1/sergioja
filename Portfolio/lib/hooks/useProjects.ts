'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '../api-client';
import { logger } from '../logger';
import { cache, CacheTTL, buildVersionedKey } from '../cache';
import type { Project, PaginatedResponse } from '@/shared/types';

interface UseProjectsOptions {
  tech?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  useCache?: boolean;
  lightweight?: boolean; // Use /projects/list (lighter payload for cards)
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
    options?.lightweight,
  ]);

  // Generar clave de caché única basada en las opciones
  const requestParams = useMemo(() => ({
    tech: stableOptions?.tech,
    category: stableOptions?.category,
    featured: stableOptions?.featured,
    page: stableOptions?.page,
    limit: stableOptions?.limit,
  }), [stableOptions?.tech, stableOptions?.category, stableOptions?.featured, stableOptions?.page, stableOptions?.limit]);

  useEffect(() => {
    // Skip fetch when options is undefined (server data is being used directly)
    if (!stableOptions) {
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        logger.debug('Fetching projects', stableOptions, 'useProjects');
        const startTime = performance.now();
        
        const shouldUseCache = stableOptions?.useCache !== false;
        const isLightweight = stableOptions?.lightweight !== false; // Default to lightweight
        const fetcher = isLightweight ? api.getProjectsList : api.getProjects;
        
        let response;
        if (shouldUseCache) {
          // Usar cacheVersion del response para invalidación automática
          const cachePrefix = isLightweight ? 'projects-list' : 'projects';
          const tempKey = buildVersionedKey(cachePrefix, requestParams, undefined);
          response = await cache.fetchWithCache(
            tempKey,
            () => fetcher(stableOptions),
            CacheTTL.FIVE_MINUTES
          );
          
          // Si el response incluye cacheVersion, actualizar la key con versión
          if (response.cacheVersion) {
            const versionedKey = buildVersionedKey('projects', requestParams, response.cacheVersion);
            // Si la versión cambió, invalidar caché antiguo
            if (versionedKey !== tempKey) {
              cache.delete(tempKey);
              cache.set(versionedKey, response, CacheTTL.FIVE_MINUTES);
            }
          }
        } else {
          response = await fetcher(stableOptions);
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
  }, [requestParams, stableOptions]);

  return { projects, pagination, loading, error };
}

export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        setRedirectTo(null);
        logger.debug(`Fetching project: ${slug}`, 'useProject');

        // Usar cacheVersion del response en lugar de request separado
        const tempKey = buildVersionedKey(`project:${slug}`, undefined, undefined);
        const response = await cache.fetchWithCache(
          tempKey,
          () => api.getProjectBySlug(slug),
          CacheTTL.FIVE_MINUTES
        );
        
        // Si el response incluye cacheVersion, actualizar la key
        if (response.cacheVersion) {
          const versionedKey = buildVersionedKey(`project:${slug}`, undefined, response.cacheVersion);
          if (versionedKey !== tempKey) {
            cache.delete(tempKey);
            cache.set(versionedKey, response, CacheTTL.FIVE_MINUTES);
          }
        }
        
        if (response.success && response.data) {
          setProject(response.data as Project);
          logger.info(`Loaded project: ${slug}`, 'useProject');
        } else {
          // Si el proyecto no existe, consultar si hay redirect
          logger.debug(`Project not found, checking for redirect: ${slug}`, 'useProject');
          
          try {
            const redirectResponse = await api.getRedirect(slug);
            
            if (redirectResponse.success && redirectResponse.data) {
              const data = redirectResponse.data as any;
              if (data.redirectTo) {
                const targetSlug = data.redirectTo;
                logger.info(`Redirect found: ${slug} → ${targetSlug}`, 'useProject');
                setRedirectTo(targetSlug);
                return;
              }
            }
          } catch (redirectError) {
            logger.debug('No redirect found for slug', redirectError, 'useProject');
          }
          
          // No hay proyecto ni redirect, es un 404 real
          const errorMsg = response.error?.message || 'Project not found';
          setError(errorMsg);
          setProject(null);
          logger.warn(`Project not found: ${slug}`, response.error, 'useProject');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMsg);
        setProject(null);
        logger.error(`Error fetching project: ${slug}`, err, 'useProject');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  return { project, loading, error, redirectTo };
}
