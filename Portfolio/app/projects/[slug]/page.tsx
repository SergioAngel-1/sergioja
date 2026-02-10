import { notFound, redirect } from 'next/navigation';
import { serverFetch } from '@/lib/server-fetch';
import { getProject } from '@/lib/getProject';
import ProjectDetailContent from '@/components/organisms/ProjectDetailContent';
import type { Project, PaginatedResponse } from '@/shared/types';

type Params = { slug: string };

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = params;

  // Reuses React cache() — same request as layout/generateMetadata, zero extra fetch
  const project = await getProject(slug);

  // If no project, check for slug redirect before 404
  if (!project) {
    try {
      const redirectRes = await serverFetch<{ redirectTo: string }>(
        `/api/portfolio/redirects/${encodeURIComponent(slug)}`,
        { revalidate: 3600 }
      );
      if (redirectRes.success && redirectRes.data?.redirectTo) {
        redirect(`/projects/${redirectRes.data.redirectTo}`);
      }
    } catch {
      // No redirect found, fall through to 404
    }
    notFound();
  }

  // Fetch related projects server-side
  // Strategy: try by category first, backfill with general if not enough
  const category = project.categories?.[0];
  let relatedProjects: Project[] = [];

  if (category) {
    const catRes = await serverFetch<PaginatedResponse<Project>>(
      `/api/portfolio/projects/list?limit=5&category=${encodeURIComponent(category)}`,
      { revalidate: 60 }
    );
    if (catRes.success && catRes.data) {
      relatedProjects = catRes.data.data.filter(p => p.id !== project.id);
    }
  }

  // Backfill: if less than 4, fetch general projects to complete
  if (relatedProjects.length < 4) {
    const generalRes = await serverFetch<PaginatedResponse<Project>>(
      '/api/portfolio/projects/list?limit=8',
      { revalidate: 60 }
    );
    if (generalRes.success && generalRes.data) {
      const existingIds = new Set([project.id, ...relatedProjects.map(p => p.id)]);
      const backfill = generalRes.data.data.filter(p => !existingIds.has(p.id));
      relatedProjects = [...relatedProjects, ...backfill];
    }
  }

  relatedProjects = relatedProjects.slice(0, 4);

  return (
    <ProjectDetailContent
      project={project}
      relatedProjects={relatedProjects}
    />
  );
}
