<<<<<<< HEAD
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('weather-store').then((cache) => {
    return cache.addAll(['index.html', 'weather.js', 'icon.png']);
  }));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
=======
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('weather-store').then((cache) => {
    return cache.addAll(['index.html', 'weather.js', 'icon.png']);
  }));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
>>>>>>> 8809d0bc1b6ad2305e1d6d36299fbeeaade10e8d
});