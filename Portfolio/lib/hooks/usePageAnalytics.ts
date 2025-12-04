/**
 * Hook de Page Analytics para Portfolio
 * Wrapper del hook compartido con source='portfolio'
 */

import { usePageAnalytics as useSharedPageAnalytics } from '@/shared/hooks/usePageAnalytics';
import { trackScrollDepth, trackTimeOnPage } from '@/lib/analytics';

export function usePageAnalytics() {
  useSharedPageAnalytics(trackScrollDepth, trackTimeOnPage);
}
