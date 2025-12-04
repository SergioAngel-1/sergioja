/**
 * Hook para tracking automático de scroll depth y time on page
 * Uso: usePageAnalytics(source) en cada página
 */

import { useEffect, useRef } from 'react';

interface ScrollDepthTracked {
  [key: number]: boolean;
}

export function usePageAnalytics(
  trackScrollDepth: (depth: number) => void,
  trackTimeOnPage: (seconds: number) => void
) {
  const scrollDepthTracked = useRef<ScrollDepthTracked>({});
  const startTime = useRef<number>(Date.now());
  const timeTracked = useRef<boolean>(false);

  useEffect(() => {
    // Reset al montar
    scrollDepthTracked.current = {};
    startTime.current = Date.now();
    timeTracked.current = false;

    // Scroll depth tracking
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      // Track at 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (
          scrollPercentage >= milestone &&
          !scrollDepthTracked.current[milestone]
        ) {
          scrollDepthTracked.current[milestone] = true;
          trackScrollDepth(milestone);
        }
      });
    };

    // Time on page tracking
    const handleBeforeUnload = () => {
      if (!timeTracked.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        trackTimeOnPage(timeSpent);
        timeTracked.current = true;
      }
    };

    // Track time on page when user leaves or switches tab
    const handleVisibilityChange = () => {
      if (document.hidden && !timeTracked.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        trackTimeOnPage(timeSpent);
        timeTracked.current = true;
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial scroll check (in case page loads scrolled)
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Track time on page on unmount if not already tracked
      if (!timeTracked.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        trackTimeOnPage(timeSpent);
        timeTracked.current = true;
      }
    };
  }, [trackScrollDepth, trackTimeOnPage]);
}
