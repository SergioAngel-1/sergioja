/**
 * Hook to track project views
 * Automatically saves project view to backend when project is loaded
 */

import { useEffect, useRef } from 'react';
import { logger } from '../logger';

export function useProjectView(projectId: string | null | undefined, projectSlug?: string) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per project load
    if (!projectId || tracked.current) return;

    const trackView = async () => {
      try {
        const userAgent = navigator.userAgent;
        const referrer = document.referrer;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analytics/project-view`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectId,
              userAgent,
              referrer: referrer || undefined,
            }),
          }
        );

        if (response.ok) {
          logger.info('Project view tracked', { projectId, projectSlug }, 'useProjectView');
          tracked.current = true;
        } else {
          logger.error('Failed to track project view', { status: response.status }, 'useProjectView');
        }
      } catch (error) {
        logger.error('Error tracking project view', error, 'useProjectView');
      }
    };

    trackView();
  }, [projectId, projectSlug]);
}
