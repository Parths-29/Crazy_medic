const CACHE_NAME = "crazy-medic-shell-v1";
const SHELL_ASSETS = ["/offline.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // SECURITY RULE: NEVER cache API routes, auth routes, paid PDFs, or viewer pages
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/viewer") ||
    url.pathname.startsWith("/library") ||
    url.pathname.startsWith("/admin") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((cached) => cached || caches.match("/offline.html"))
    )
  );
});
