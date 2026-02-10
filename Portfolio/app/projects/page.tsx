import { serverFetch } from '@/lib/server-fetch';
import type { Project, PaginatedResponse } from '@/shared/types';
import type { ProjectCategory } from '@/lib/hooks/useProjectCategories';
import ProjectsContent from '../../components/organisms/ProjectsContent';

export default async function WorkPage() {
  // Server-side parallel fetch: projects + categories
  const [projectsRes, categoriesRes] = await Promise.all([
    serverFetch<PaginatedResponse<Project>>('/api/portfolio/projects/list?limit=100', { revalidate: 60 }),
    serverFetch<ProjectCategory[]>('/api/categories/projects', { revalidate: 300 }),
  ]);

  const initialProjects = projectsRes.success && projectsRes.data
    ? projectsRes.data.data
    : [];

  const initialCategories = categoriesRes.success && categoriesRes.data
    ? (categoriesRes.data as ProjectCategory[]).filter(c => c.active)
    : [];

  return (
    <ProjectsContent
      initialProjects={initialProjects}
      initialCategories={initialCategories}
    />
  );
}
