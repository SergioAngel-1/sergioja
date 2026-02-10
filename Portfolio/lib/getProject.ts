import { cache } from 'react';
import type { ApiResponse, Project } from '@/shared/types';

const getApiUrl = () =>
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Cached function to fetch project data (shared between metadata, layout, and page)
// React cache() deduplicates within the same server request
export const getProject = cache(async (slug: string): Promise<Project | null> => {
  try {
    const res = await fetch(
      `${getApiUrl()}/api/portfolio/projects/${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } }
    );

    if (res.ok) {
      const json = (await res.json()) as ApiResponse<Project>;
      return json.data || null;
    }
  } catch (error) {
    console.error('Error fetching project:', error);
  }

  return null;
});
