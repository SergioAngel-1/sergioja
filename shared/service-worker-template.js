// Service Worker Template for SergioJA Projects
// This file is used as a template and will be processed by next-pwa

const CACHE_NAME = 'sergioja-cache-v1';
const RUNTIME_CACHE = 'sergioja-runtime-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete old caches
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets - Cache first, network fallback
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/favicon/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        });
      })
    );
    return;
  }

  // HTML pages - Network first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response before caching
        const responseToCache = response.clone();
        
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If no cache, show offline page
          return caches.match('/offline');
        });
      })
  );
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});

// Push notification event (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon/android-chrome-192x192.png',
    badge: '/favicon/android-chrome-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
