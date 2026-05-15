// Cambia il nome per forzare l'aggiornamento della cache!
const CACHE_NAME = 'capitally-v2'; 

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './world.js',
  './leaflet.js',
  './leaflet.css',
  './icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});