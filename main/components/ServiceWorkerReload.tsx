'use client';

import { useEffect } from 'react';

export default function ServiceWorkerReload() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV === 'development') {
      // In dev mode, any SW registered from a previous production build stays
      // active even though next-pwa sets disable:true (which only prevents
      // new registrations). That lingering SW caches dev chunks with CacheFirst
      // and serves stale eval() bundles on reload → SyntaxError layout.js:333.
      // Fix: unregister all SWs + clear their caches, then reload once.
      navigator.serviceWorker.getRegistrations().then(async (regs) => {
        if (regs.length === 0) return;
        await Promise.all(regs.map((r) => r.unregister()));
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
        window.location.reload();
      });
      return;
    }

    // Production: when a new SW takes control (skipWaiting:true fires immediately),
    // the current page still holds old chunk hash references → those 404 and
    // get cached as broken HTML. Reload now to get fresh HTML with new hashes.
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }, []);

  return null;
}
