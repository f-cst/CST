// Service Worker ساده‌تر
const CACHE_NAME = 'cst-robot-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // هیچ کاری نکن - فقط از شبکه بگیر
  event.respondWith(fetch(event.request));
});
