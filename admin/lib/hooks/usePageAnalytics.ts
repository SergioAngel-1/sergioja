/**
 * Hook de Page Analytics para Admin
 * Wrapper del hook compartido con source='admin'
 */

import { usePageAnalytics as useSharedPageAnalytics } from '@/shared/hooks/usePageAnalytics';
import { trackScrollDepth, trackTimeOnPage } from '@/lib/analytics';

export function usePageAnalytics() {
  useSharedPageAnalytics(trackScrollDepth, trackTimeOnPage);
}
