const CACHE_NAME = "overreact-v1";
const OFFLINE_PAGE = "/_overreact/vendor/html/offline.html";
const TIMEOUT_PAGE = "/_overreact/vendor/html/timeout.html";
const BOOTSTRAP = "/_overreact/vendor/client/components/bootstrap.js";

// Assets to cache on install
const CRITICAL_ASSETS = [
  OFFLINE_PAGE,
  TIMEOUT_PAGE,
  BOOTSTRAP,
  "/_overreact/vendor/client/sockets/index.js",
  "/_overreact/vendor/client/http/index.js",
  "/_overreact/vendor/client/config/index.js",
  "/_overreact/app/Client/offline.js",
  "/_overreact/app/Client/timeout.js",
];

// Install event - cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CRITICAL_ASSETS).catch((error) => {
        console.error("Cache addAll failed:", error);
        // Continue even if some assets fail to cache
        return Promise.all(
          CRITICAL_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`Failed to cache ${url}:`, err);
            })
          )
        );
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to offline page
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome extensions and other non-http requests
  if (!request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((response) => {
      // Return cached response if available
      if (response) {
        return response;
      }

      // Try to fetch from network
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === "error") {
            return response;
          }

          // Cache successful HTML responses
          if (request.headers.get("accept")?.includes("text/html")) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache).catch((error) => {
                console.warn("Cache put failed:", error);
              });
            });
          }

          return response;
        })
        .catch(() => {
          // Network request failed - return offline page for HTML requests
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match(OFFLINE_PAGE).catch(() => {
              return new Response("Offline", { status: 503 });
            });
          }

          // For other requests, try to return a cached version
          return caches.match(request).catch(() => {
            return new Response("Offline", { status: 503 });
          });
        });
    })
  );
});

// Message handler for cache updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
