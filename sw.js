const CACHE_NAME = 'capitally-cache-v3'; // <--- Questo numero cambierà ai prossimi aggiornamenti
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './world.js',
  './manifest.json',
  './capitally-icon.png'
];

// Installazione e attivazione immediata senza attendere
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Forza il nuovo Service Worker a diventare attivo subito
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Cancella le vecchie cache automaticamente
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prende subito il controllo della pagina
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});