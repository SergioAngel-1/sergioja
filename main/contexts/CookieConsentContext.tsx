'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  type ConsentStatus,
  isBrowser,
  getStoredConsentStatus,
  storeConsentStatus,
  getPreviousConsentStatus,
  storePreviousConsentStatus,
  clearPreviousConsentStatus,
  ensureDataLayer,
  resetDataLayer,
  toggleGtm,
  clearTrackingCookies,
  dispatchConsentEvents,
} from '@/shared/cookieConsent';

interface CookieConsentContextType {
  consentStatus: ConsentStatus;
  acceptCookies: () => void;
  rejectCookies: () => void;
  resetConsent: () => void;
  openPreferences: () => string | null;
  hasConsent: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() => getStoredConsentStatus() || 'pending');
  const [isClient, setIsClient] = useState(false);

  // Initialize client state and apply stored consent on mount
  useEffect(() => {
    setIsClient(true);
    const stored = getStoredConsentStatus();
    if (stored) {
      setConsentStatus(stored);

      // Apply stored consent side effects only on mount
      if (stored === 'accepted') {
        ensureDataLayer();
        toggleGtm(true);
      } else if (stored === 'rejected') {
        toggleGtm(false);
        // Don't clear cookies on mount, only on explicit reject action
      }
    }
  }, []);

  const acceptCookies = useCallback(() => {
    if (!isBrowser()) return;
    const previousStatus = getStoredConsentStatus() || getPreviousConsentStatus();

    storeConsentStatus('accepted');
    clearPreviousConsentStatus();
    ensureDataLayer();
    toggleGtm(true);
    dispatchConsentEvents('accepted', previousStatus);

    // Always reload to ensure GTM scripts load from a clean page init
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, []);

  const rejectCookies = useCallback(() => {
    if (!isBrowser()) return;
    const previousStatus = getStoredConsentStatus() || getPreviousConsentStatus();

    storeConsentStatus('rejected');
    clearPreviousConsentStatus();
    clearTrackingCookies();
    resetDataLayer();
    toggleGtm(false);
    dispatchConsentEvents('rejected', previousStatus);

    // Always reload to ensure GTM scripts are fully removed and page is clean
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, []);

  const resetConsent = useCallback(() => {
    setConsentStatus('pending');
    storeConsentStatus(null);
  }, []);

  const openPreferences = useCallback(() => {
    const currentStatus = getStoredConsentStatus();

    if (currentStatus) {
      storePreviousConsentStatus(currentStatus);
    }

    storeConsentStatus(null);
    setConsentStatus('pending');

    return currentStatus;
  }, []);

  const hasConsent = consentStatus === 'accepted';

  return (
    <CookieConsentContext.Provider
      value={{
        consentStatus: isClient ? consentStatus : 'pending',
        acceptCookies,
        rejectCookies,
        resetConsent,
        openPreferences,
        hasConsent: isClient && hasConsent
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
