import type { ApiResponse } from '@/shared/types';

const getApiUrl = () =>
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Server-side fetch for use in Server Components and generateMetadata.
 * Uses INTERNAL_API_URL (Docker internal) with fallback to NEXT_PUBLIC_API_URL.
 * Includes Next.js revalidation for ISR caching.
 */
export async function serverFetch<T>(
  path: string,
  options?: { revalidate?: number }
): Promise<ApiResponse<T>> {
  const url = `${getApiUrl()}${path}`;
  const res = await fetch(url, {
    next: { revalidate: options?.revalidate ?? 60 },
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    return {
      success: false,
      error: {
        message: `Server fetch failed: ${res.status}`,
        code: 'SERVER_FETCH_ERROR',
      },
    };
  }

  return res.json();
}
