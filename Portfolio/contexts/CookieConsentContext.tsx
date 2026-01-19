'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

interface CookieConsentContextType {
  consentStatus: ConsentStatus;
  acceptCookies: () => void;
  rejectCookies: () => void;
  resetConsent: () => void;
  openPreferences: () => string | null;
  hasConsent: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const STORAGE_KEY = 'cookie-consent';
const PREVIOUS_STATUS_KEY = 'cookie-consent-previous';
const TRACKING_COOKIE_PREFIXES = ['_ga', '_gid', '_gat', '_ga_', '_gcl_', '_fbp'];

type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

const isBrowser = () => typeof window !== 'undefined';

const safeSessionStorage = () => {
  if (!isBrowser()) return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const getWindowWithDataLayer = () => (window as unknown as WindowWithDataLayer);

const getStoredStatus = (): ConsentStatus | null => {
  if (!isBrowser()) return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'accepted' || stored === 'rejected' ? stored : null;
};

const storeConsentStatus = (status: ConsentStatus | null) => {
  if (!isBrowser()) return;
  if (status) {
    window.localStorage.setItem(STORAGE_KEY, status);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

const ensureDataLayer = () => {
  if (!isBrowser()) return;
  const win = getWindowWithDataLayer();
  if (!Array.isArray(win.dataLayer)) {
    win.dataLayer = [];
  }
};

const resetDataLayer = () => {
  if (!isBrowser()) return;
  const win = getWindowWithDataLayer();
  win.dataLayer = [];
};

const toggleGtm = (enabled: boolean) => {
  if (!isBrowser()) return;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (gtmId) {
    getWindowWithDataLayer()[`gtm-disable-${gtmId}`] = !enabled;
  }
};

const getDomainVariants = () => {
  if (!isBrowser()) return [''];
  const host = window.location.hostname;
  const parts = host.split('.');
  const variants = new Set<string>(['', host]);
  if (parts.length >= 2) {
    variants.add(`.${parts.slice(-2).join('.')}`);
  }
  return Array.from(variants);
};

const clearTrackingCookies = () => {
  if (!isBrowser() || typeof document === 'undefined') return;
  const cookies = document.cookie ? document.cookie.split(';') : [];
  const domains = getDomainVariants();

  cookies.forEach((cookie) => {
    const [rawName] = cookie.split('=');
    const name = rawName?.trim();
    if (!name) return;
    const shouldClear = TRACKING_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix));
    if (!shouldClear) return;

    domains.forEach((domain) => {
      // Try multiple SameSite variations to ensure complete deletion
      // Modern browsers require matching SameSite attribute to delete cookies
      const baseStr = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;${domain ? ` domain=${domain};` : ''}`;
      const variations = [
        baseStr,
        `${baseStr} SameSite=Lax`,
        `${baseStr} SameSite=None; Secure`,
        `${baseStr} SameSite=Strict`,
      ];

      variations.forEach(cookieStr => {
        try {
          document.cookie = cookieStr;
        } catch (e) {
          // Silent fail for invalid combinations (e.g., SameSite=None without Secure on HTTP)
        }
      });
    });
  });
};

const dispatchConsentEvents = (status: ConsentStatus, previousStatus: ConsentStatus | null) => {
  if (!isBrowser()) return;
  window.dispatchEvent(
    new CustomEvent('cookieConsentChanged', {
      detail: { status, previousStatus },
    })
  );

  const eventName = status === 'accepted' ? 'cookieConsentAccepted' : 'cookieConsentRejected';
  window.dispatchEvent(new CustomEvent(eventName));
};

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() => getStoredStatus() || 'pending');
  const [isClient, setIsClient] = useState(false);

  // Initialize client state and apply stored consent on mount
  useEffect(() => {
    setIsClient(true);
    const stored = getStoredStatus();
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

  const getPreviousStatus = () => {
    const storage = safeSessionStorage();
    if (!storage) return null;
    const previous = storage.getItem(PREVIOUS_STATUS_KEY);
    return previous === 'accepted' || previous === 'rejected' ? (previous as ConsentStatus) : null;
  };

  const clearPreviousStatus = () => {
    const storage = safeSessionStorage();
    storage?.removeItem(PREVIOUS_STATUS_KEY);
  };

  const acceptCookies = useCallback(() => {
    if (!isBrowser()) return;
    const previousStatus = getStoredStatus() || getPreviousStatus();
    const isChangingDecision = previousStatus && previousStatus !== 'accepted';

    setConsentStatus('accepted');
    storeConsentStatus('accepted');
    clearPreviousStatus();
    ensureDataLayer();
    toggleGtm(true);
    dispatchConsentEvents('accepted', previousStatus);

    // Reload page if user is changing their previous decision
    // This ensures GTM and other components properly reinitialize
    if (isChangingDecision) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, []);

  const rejectCookies = useCallback(() => {
    if (!isBrowser()) return;
    const previousStatus = getStoredStatus() || getPreviousStatus();
    const isChangingDecision = previousStatus && previousStatus !== 'rejected';

    setConsentStatus('rejected');
    storeConsentStatus('rejected');
    clearPreviousStatus();
    clearTrackingCookies();
    resetDataLayer();
    toggleGtm(false);
    dispatchConsentEvents('rejected', previousStatus);

    // Reload page if user is changing their previous decision
    // This ensures GTM scripts are completely removed and cookies cleared
    if (isChangingDecision) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, []);

  const resetConsent = useCallback(() => {
    setConsentStatus('pending');
    storeConsentStatus(null);
  }, []);

  const openPreferences = useCallback(() => {
    const currentStatus = getStoredStatus();

    if (currentStatus) {
      const storage = safeSessionStorage();
      storage?.setItem(PREVIOUS_STATUS_KEY, currentStatus);
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
