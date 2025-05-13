const CACHE_NAME = 'exam-schedule-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Cài đặt service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Xử lý các request
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Trả về cached response nếu có
        if (response) {
          return response;
        }
        // Nếu không có trong cache, thực hiện fetch
        return fetch(event.request);
      })
  );
});