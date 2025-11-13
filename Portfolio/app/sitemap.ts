/**
 * Sitemap - Portfolio Frontend
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * 
 * Este sitemap puede ser dinámico, obteniendo proyectos desde la API
 */

import { MetadataRoute } from 'next';
import type { ApiResponse, PaginatedResponse, Project } from '@/shared/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.sergioja.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const currentDate = new Date();

  // URLs estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          es: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ];

  // URLs dinámicas de proyectos
  try {
    const res = await fetch(`${apiUrl}/api/portfolio/projects?limit=1000`, { 
      next: { revalidate: 3600 } 
    });
    
    if (res.ok) {
      const json = (await res.json()) as ApiResponse<PaginatedResponse<Project>>;
      const list = json.data?.data || [];
      
      const projectRoutes: MetadataRoute.Sitemap = list
        .filter((p) => p.slug)
        .map((p) => ({
          url: `${baseUrl}/projects/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : currentDate,
          changeFrequency: 'monthly',
          priority: 0.6,
        }));
      
      return [...staticRoutes, ...projectRoutes];
    }
  } catch (e) {
    // Si la API falla, retornamos solo rutas estáticas
    console.error('Error fetching projects for sitemap:', e);
  }

  return staticRoutes;
}
