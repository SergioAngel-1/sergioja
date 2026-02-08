/**
 * Cookie Consent - Shared Module
 * Pure TS logic for cookie consent management, GTM toggling, and tracking cookie cleanup.
 * Used by all frontends (main, portfolio).
 * 
 * NOTE: This module is pure TypeScript (no React/JSX). 
 * React components (Context, Banner, GTMLoader) live in each frontend.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

export type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const CONSENT_STORAGE_KEY = 'cookie-consent';
export const CONSENT_PREVIOUS_STATUS_KEY = 'cookie-consent-previous';
export const TRACKING_COOKIE_PREFIXES = ['_ga', '_gid', '_gat', '_ga_', '_gcl_', '_fbp'];

// ─── Browser Guards ──────────────────────────────────────────────────────────

export const isBrowser = (): boolean => typeof window !== 'undefined';

export const safeSessionStorage = (): Storage | null => {
  if (!isBrowser()) return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const getWindowWithDataLayer = (): WindowWithDataLayer =>
  window as unknown as WindowWithDataLayer;

// ─── Storage Helpers ─────────────────────────────────────────────────────────

export const getStoredConsentStatus = (): ConsentStatus | null => {
  if (!isBrowser()) return null;
  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return stored === 'accepted' || stored === 'rejected' ? stored : null;
};

export const storeConsentStatus = (status: ConsentStatus | null): void => {
  if (!isBrowser()) return;
  if (status) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } else {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  }
};

export const getPreviousConsentStatus = (): ConsentStatus | null => {
  const storage = safeSessionStorage();
  if (!storage) return null;
  const previous = storage.getItem(CONSENT_PREVIOUS_STATUS_KEY);
  return previous === 'accepted' || previous === 'rejected' ? (previous as ConsentStatus) : null;
};

export const storePreviousConsentStatus = (status: string): void => {
  const storage = safeSessionStorage();
  storage?.setItem(CONSENT_PREVIOUS_STATUS_KEY, status);
};

export const clearPreviousConsentStatus = (): void => {
  const storage = safeSessionStorage();
  storage?.removeItem(CONSENT_PREVIOUS_STATUS_KEY);
};

// ─── DataLayer Helpers ───────────────────────────────────────────────────────

export const ensureDataLayer = (): void => {
  if (!isBrowser()) return;
  const win = getWindowWithDataLayer();
  if (!Array.isArray(win.dataLayer)) {
    win.dataLayer = [];
  }
};

export const resetDataLayer = (): void => {
  if (!isBrowser()) return;
  const win = getWindowWithDataLayer();
  win.dataLayer = [];
};

// ─── GTM Toggle ──────────────────────────────────────────────────────────────

export const toggleGtm = (enabled: boolean, gtmId?: string): void => {
  if (!isBrowser()) return;
  const id = gtmId || process.env.NEXT_PUBLIC_GTM_ID;
  if (id) {
    getWindowWithDataLayer()[`gtm-disable-${id}`] = !enabled;
  }
};

// ─── Cookie Cleanup ──────────────────────────────────────────────────────────

const getDomainVariants = (): string[] => {
  if (!isBrowser()) return [''];
  const host = window.location.hostname;
  const parts = host.split('.');
  const variants = new Set<string>(['', host]);
  if (parts.length >= 2) {
    variants.add(`.${parts.slice(-2).join('.')}`);
  }
  return Array.from(variants);
};

export const clearTrackingCookies = (): void => {
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

// ─── Consent Events ──────────────────────────────────────────────────────────

export const dispatchConsentEvents = (status: ConsentStatus, previousStatus: ConsentStatus | null): void => {
  if (!isBrowser()) return;
  window.dispatchEvent(
    new CustomEvent('cookieConsentChanged', {
      detail: { status, previousStatus },
    })
  );

  const eventName = status === 'accepted' ? 'cookieConsentAccepted' : 'cookieConsentRejected';
  window.dispatchEvent(new CustomEvent(eventName));
};
