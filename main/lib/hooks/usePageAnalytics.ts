/**
 * Hook de Page Analytics para Main
 * Wrapper del hook compartido con source='main'
 */

import { usePageAnalytics as useSharedPageAnalytics } from '@/shared/hooks/usePageAnalytics';
import { trackScrollDepth, trackTimeOnPage } from '@/lib/analytics';

export function usePageAnalytics() {
  useSharedPageAnalytics(trackScrollDepth, trackTimeOnPage);
}
