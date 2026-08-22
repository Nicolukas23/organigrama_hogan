/**
 * sw.js — Service Worker de Claro Talento Ejecutivo (PWA & Offline Cache)
 */

const CACHE_NAME = 'claro-talento-v2';
const STATIC_ASSETS = [
  './data/theme.css',
  './data/tableros.css',
  './data/nav.css',
  './data/global_search.js',
  './data/print_onepager.css',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@600;700;800&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA: algunos assets no pudieron precachearse:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar llamadas no GET
  if (event.request.method !== 'GET') return;

  // 1. Estrategia Stale-While-Revalidate para estilos y scripts
  if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 2. Estrategia Network-First para páginas HTML y llamadas a Supabase
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.status === 200) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copy);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});
