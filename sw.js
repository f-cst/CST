const CACHE_NAME = 'cst-robot-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// نصب Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker نصب شد');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('کش کردن فایل‌ها');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker فعال شد');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('حذف کش قدیمی:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// مدیریت درخواست‌ها
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // صفحه آفلاین ساده
            return new Response(`
              <!DOCTYPE html>
              <html lang="fa" dir="rtl">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>آفلاین - ربات CST</title>
                <style>
                  body { 
                    font-family: Tahoma; 
                    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                    color: white; 
                    text-align: center; 
                    padding: 50px; 
                    direction: rtl;
                  }
                </style>
              </head>
              <body>
                <h1>📶 آفلاین هستید</h1>
                <p>اتصال اینترنت خود را بررسی کنید</p>
                <p>ربات CST</p>
              </body>
              </html>
            `, {
              headers: {
                'Content-Type': 'text/html; charset=utf-8'
              }
            });
          });
      })
  );
});