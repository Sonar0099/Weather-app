self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('weather-store').then((cache) => {
    return cache.addAll(['index.html', 'weather.js', 'icon.png']);
  }));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});