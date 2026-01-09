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

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'accepted' || stored === 'rejected') {
      setConsentStatus(stored as ConsentStatus);
    }
  }, []);

  const acceptCookies = useCallback(() => {
    // Check both localStorage and sessionStorage for previous status
    const previousStatus = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem('cookie-consent-previous');
    setConsentStatus('accepted');
    localStorage.setItem(STORAGE_KEY, 'accepted');
    sessionStorage.removeItem('cookie-consent-previous');
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentAccepted'));
      
      // If status changed, trigger reload
      if (previousStatus && previousStatus !== 'accepted') {
        console.log('[CookieConsent] Status changed from', previousStatus, 'to accepted - reloading...');
        setTimeout(() => window.location.reload(), 500);
      }
    }
  }, []);

  const rejectCookies = useCallback(() => {
    // Check both localStorage and sessionStorage for previous status
    const previousStatus = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem('cookie-consent-previous');
    setConsentStatus('rejected');
    localStorage.setItem(STORAGE_KEY, 'rejected');
    sessionStorage.removeItem('cookie-consent-previous');
    
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = [];
      
      const cookies = document.cookie.split(';');
      cookies.forEach(cookie => {
        const [name] = cookie.split('=');
        const trimmedName = name.trim();
        if (trimmedName.startsWith('_ga') || trimmedName.startsWith('_gid') || trimmedName.startsWith('_gat')) {
          document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
          document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      
      // If status changed, trigger reload
      if (previousStatus && previousStatus !== 'rejected') {
        console.log('[CookieConsent] Status changed from', previousStatus, 'to rejected - reloading...');
        setTimeout(() => window.location.reload(), 500);
      }
    }
  }, []);

  const resetConsent = useCallback(() => {
    setConsentStatus('pending');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const openPreferences = useCallback(() => {
    const currentStatus = localStorage.getItem(STORAGE_KEY);
    
    // Store previous status in sessionStorage so accept/reject can detect changes
    if (currentStatus) {
      sessionStorage.setItem('cookie-consent-previous', currentStatus);
    }
    
    localStorage.removeItem(STORAGE_KEY);
    setConsentStatus('pending');
    
    // Return current status so caller can detect if it changed
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
