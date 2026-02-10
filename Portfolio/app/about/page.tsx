import { serverFetch } from '@/lib/server-fetch';
import AboutContent from '@/components/organisms/AboutContent';
import type { Skill, Profile } from '@/shared/types';

interface TechnologyCategory {
  name: string;
  label: string;
  active: boolean;
  color?: string;
  icon?: string;
}

export default async function AboutPage() {
  // Server-side parallel fetch: skills + profile + technology categories
  const [skillsRes, profileRes, categoriesRes] = await Promise.all([
    serverFetch<Skill[]>('/api/portfolio/skills', { revalidate: 300 }),
    serverFetch<Profile>('/api/portfolio/profile', { revalidate: 300 }),
    serverFetch<TechnologyCategory[]>('/api/categories/technologies', { revalidate: 300 }),
  ]);

  const initialSkills = skillsRes.success && skillsRes.data
    ? skillsRes.data as Skill[]
    : [];

  const initialProfile = profileRes.success && profileRes.data
    ? profileRes.data as Profile
    : null;

  const initialCategories = categoriesRes.success && categoriesRes.data
    ? (categoriesRes.data as TechnologyCategory[]).filter(c => c.active)
    : [];

  return (
    <AboutContent
      initialSkills={initialSkills}
      initialProfile={initialProfile}
      initialCategories={initialCategories}
    />
  );
}
