'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '../api-client';
import { logger } from '../logger';
import { cache, CacheTTL } from '../cache';
import type { Project, PaginatedResponse } from '@/shared/types';

// Proyecto hardcodeado: SergioJA (main landing)
const SERGIOJA_PROJECT: Project = {
  id: 'sergioja',
  title: 'SergioJA',
  slug: 'sergioja',
  description: 'Landing page minimalista con diseño cyberpunk y arquitectura hexagonal interactiva.',
  longDescription: 'Sitio principal con diseño cyberpunk minimalista, featuring un hero hexagonal central con 4 modales esquineros (Navigation, Identity, Purpose, Connection). Construido con Next.js 14, Framer Motion, y sistema de diseño fluido sin breakpoints. Incluye efectos visuales avanzados como scanlines CRT, partículas flotantes, y un sistema de navegación único basado en hexágonos.',
  image: '/media/projects/SergioJA.com.png',
  images: ['/media/projects/SergioJA.com.png'],
  technologies: ['Next.js', 'React', 'TypeScript', 'Framer Motion', 'TailwindCSS', 'Three.js'],
  tech: ['Next.js', 'React', 'TypeScript', 'Framer Motion', 'TailwindCSS', 'Three.js'],
  category: 'web',
  featured: true,
  demoUrl: 'https://sergioja.com',
  githubUrl: 'https://github.com/SergioAngel-1/sergioja',
  repoUrl: 'https://github.com/SergioAngel-1/sergioja',
  isCodePublic: false,
  status: 'completed' as const,
  startDate: '2024-11-01',
  endDate: '2024-11-18',
  metrics: {
    performance: 98,
    accessibility: 100,
    seo: 100,
  },
  createdAt: new Date('2024-11-01').toISOString(),
  updatedAt: new Date().toISOString(),
};

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
          
          // Agregar proyecto hardcodeado al inicio si cumple con los filtros
          const shouldIncludeHardcoded = 
            (!stableOptions?.category || stableOptions.category === SERGIOJA_PROJECT.category) &&
            (!stableOptions?.featured || SERGIOJA_PROJECT.featured) &&
            (!stableOptions?.tech || SERGIOJA_PROJECT.tech.includes(stableOptions.tech));
          
          const projectsWithHardcoded = shouldIncludeHardcoded 
            ? [SERGIOJA_PROJECT, ...data.data]
            : data.data;
          
          setProjects(projectsWithHardcoded);
          setPagination(data.pagination);
          logger.info(`Loaded ${projectsWithHardcoded.length} projects ${shouldUseCache ? '(cached)' : ''}`, undefined, 'useProjects');
        } else {
          const errorMsg = response.error?.message || 'Failed to fetch projects';
          setError(errorMsg);
          logger.warn('Failed to fetch projects', response.error, 'useProjects');
        }
      } catch (err) {
        // Si hay error de red, mostrar solo el proyecto hardcodeado si cumple filtros
        const shouldIncludeHardcoded = 
          (!stableOptions?.category || stableOptions.category === SERGIOJA_PROJECT.category) &&
          (!stableOptions?.featured || SERGIOJA_PROJECT.featured) &&
          (!stableOptions?.tech || SERGIOJA_PROJECT.tech.includes(stableOptions.tech));
        
        if (shouldIncludeHardcoded) {
          setProjects([SERGIOJA_PROJECT]);
          logger.warn('API unavailable, showing hardcoded project only', err, 'useProjects');
        } else {
          const errorMsg = err instanceof Error ? err.message : 'An error occurred';
          setError(errorMsg);
          logger.error('Error fetching projects', err, 'useProjects');
        }
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
        
        // Si el slug es del proyecto hardcodeado, retornarlo directamente
        if (slug === SERGIOJA_PROJECT.slug) {
          setProject(SERGIOJA_PROJECT);
          logger.info(`Loaded hardcoded project: ${slug}`, undefined, 'useProject');
          setLoading(false);
          return;
        }
        
        logger.debug(`Fetching project: ${slug}`, undefined, 'useProject');
        const response = await api.getProjectBySlug(slug);
        
        if (response.success && response.data) {
          setProject(response.data as Project);
          logger.info(`Loaded project: ${slug}`, undefined, 'useProject');
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
