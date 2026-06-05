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
  options?: { revalidate?: number; noStore?: boolean }
): Promise<ApiResponse<T>> {
  const url = `${getApiUrl()}${path}`;
  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    headers: { 'Content-Type': 'application/json' },
  };

  if (options?.noStore) {
    fetchOptions.cache = 'no-store';
  } else {
    fetchOptions.next = { revalidate: options?.revalidate ?? 60 };
  }

  const res = await fetch(url, fetchOptions);

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
