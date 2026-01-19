'use client';

import { useEffect, useRef, useState } from 'react';

interface GTMLoaderProps {
  gtmId: string;
}

const STORAGE_KEY = 'cookie-consent';

export default function GTMLoader({ gtmId }: GTMLoaderProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const iframeRef = useRef<HTMLDivElement | null>(null);

  // Read consent from localStorage on mount and listen for changes
  useEffect(() => {
    const checkConsent = () => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      setHasConsent(stored === 'accepted');
    };
    
    checkConsent();
    
    // Listen for storage changes (when user changes consent)
    window.addEventListener('storage', checkConsent);
    // Also check periodically in case localStorage changes in same tab
    const interval = setInterval(checkConsent, 1000);
    
    return () => {
      window.removeEventListener('storage', checkConsent);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // CRITICAL: Set GTM disable flag FIRST to prevent race conditions
    const gtmDisableFlag = `gtm-disable-${gtmId}`;
    const win = window as typeof window & { [key: string]: unknown; dataLayer?: unknown[] };

    if (!hasConsent) {
      // Disable GTM immediately to prevent tracking
      win[gtmDisableFlag] = true;

      // Remove all GTM-related scripts (including dynamically loaded ones)
      const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
      gtmScripts.forEach(script => {
        try {
          script.remove();
        } catch (e) {
          // Silent fail if script cannot be removed
        }
      });

      // Remove loader script
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }

      // Remove noscript iframe
      if (iframeRef.current) {
        iframeRef.current.remove();
        iframeRef.current = null;
      }

      // Reset dataLayer
      if (Array.isArray(win.dataLayer)) {
        win.dataLayer.length = 0;
      }

      return;
    }

    if (!gtmId || scriptRef.current) {
      return;
    }

    // Enable GTM before injecting scripts
    win[gtmDisableFlag] = false;

    // Ensure dataLayer exists
    if (!Array.isArray(win.dataLayer)) {
      win.dataLayer = [];
    }

    const script = document.createElement('script');
    script.id = 'gtm-loader';
    script.innerHTML = `(function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'? '&l='+l : '';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');`;
    document.head.appendChild(script);
    scriptRef.current = script;

    const iframeWrapper = document.createElement('div');
    iframeWrapper.id = 'gtm-noscript-wrapper';
    iframeWrapper.style.position = 'absolute';
    iframeWrapper.style.width = '0px';
    iframeWrapper.style.height = '0px';
    iframeWrapper.style.overflow = 'hidden';
    iframeWrapper.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.appendChild(iframeWrapper);
    iframeRef.current = iframeWrapper;

    return () => {
      // Re-enable disable flag on cleanup
      win[gtmDisableFlag] = true;

      // Remove all GTM scripts on unmount
      const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
      gtmScripts.forEach(script => {
        try {
          script.remove();
        } catch (e) {
          // Silent fail
        }
      });

      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
      if (iframeRef.current) {
        iframeRef.current.remove();
        iframeRef.current = null;
      }

      // Reset dataLayer on cleanup
      if (Array.isArray(win.dataLayer)) {
        win.dataLayer.length = 0;
      }
    };
  }, [hasConsent, gtmId]);

  return null;
}
