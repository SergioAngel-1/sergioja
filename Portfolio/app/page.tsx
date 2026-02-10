import { serverFetch } from '@/lib/server-fetch';
import type { Profile } from '@/shared/types';
import HomeContent from '@/components/organisms/HomeContent';

export default async function Home() {
  // Server-side fetch: profile (availability status)
  const profileRes = await serverFetch<Profile>('/api/portfolio/profile', { revalidate: 300 });

  const initialProfile = profileRes.success && profileRes.data
    ? profileRes.data as Profile
    : null;

  return (
    <HomeContent initialProfile={initialProfile} />
  );
}
