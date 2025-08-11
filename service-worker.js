const CACHE = 'uc2-v1';
const ASSETS = [
  '/', '/index.html',
  '/assets/css/app.css',
  '/assets/js/core.js','/assets/js/gameplay.js','/assets/js/ui.js','/assets/js/themes.js','/assets/js/words.js',
  '/assets/click.ogg','/assets/flip.ogg','/assets/event.ogg','/assets/eliminate.ogg','/assets/timer.ogg','/assets/launch.ogg','/assets/win.ogg','/assets/lose.ogg'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));