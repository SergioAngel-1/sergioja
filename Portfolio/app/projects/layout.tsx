import type { Metadata } from 'next';
import { workMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = workMetadata;

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
