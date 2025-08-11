// ===== PREMIUM SERVICE WORKER =====

const CACHE_NAME = 'undercover-premium-v2.0.0';
const STATIC_CACHE_NAME = 'undercover-premium-static-v2.0.0';
const DYNAMIC_CACHE_NAME = 'undercover-premium-dynamic-v2.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/index-premium.html',
    '/assets/css/premium-animations.css',
    '/assets/js/premium-sounds.js',
    '/assets/js/premium-themes.js',
    '/manifest-premium.json',
    // Fonts
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap',
    // Fallback offline page
    '/offline.html'
];

// Dynamic files that can be cached on demand
const DYNAMIC_FILES = [
    '/assets/',
    '/sounds/',
    '/images/'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Premium Service Worker v2.0.0');
    
    event.waitUntil(
        Promise.all([
            // Cache static files
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                console.log('[SW] Caching static files');
                return cache.addAll(STATIC_FILES.map(url => new Request(url, {
                    cache: 'reload'
                })));
            }),
            
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Premium Service Worker v2.0.0');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME &&
                            cacheName.startsWith('undercover-premium-')) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Take control of all clients
            self.clients.claim()
        ])
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Cache First for static assets
        if (isStaticAsset(url)) {
            return await cacheFirst(request);
        }
        
        // Strategy 2: Network First for HTML pages
        if (isHTMLPage(url)) {
            return await networkFirst(request);
        }
        
        // Strategy 3: Stale While Revalidate for API calls and dynamic content
        if (isDynamicContent(url)) {
            return await staleWhileRevalidate(request);
        }
        
        // Default: Network First
        return await networkFirst(request);
        
    } catch (error) {
        console.error('[SW] Fetch failed:', error);
        return await handleOffline(request);
    }
}

// Cache First Strategy - for static assets
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE_NAME);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network First Strategy - for HTML pages
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale While Revalidate Strategy - for dynamic content
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const networkResponsePromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            const cache = caches.open(DYNAMIC_CACHE_NAME);
            cache.then(c => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    }).catch(() => {
        // Network failed, return cached version if available
        return cachedResponse;
    });
    
    return cachedResponse || networkResponsePromise;
}

// Handle offline scenarios
async function handleOffline(request) {
    const url = new URL(request.url);
    
    // Try to find a cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // For HTML pages, return offline page
    if (request.destination === 'document') {
        const offlinePage = await caches.match('/offline.html');
        if (offlinePage) {
            return offlinePage;
        }
    }
    
    // For images, return a placeholder
    if (request.destination === 'image') {
        return new Response(
            '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" fill="#999">Image non disponible</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
    
    // Return a generic offline response
    return new Response('Contenu non disponible hors ligne', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
    });
}

// Helper functions
function isStaticAsset(url) {
    return url.pathname.includes('/assets/') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.woff2') ||
           url.pathname.endsWith('.woff') ||
           url.hostname === 'fonts.googleapis.com' ||
           url.hostname === 'fonts.gstatic.com';
}

function isHTMLPage(url) {
    return url.pathname.endsWith('.html') ||
           url.pathname === '/' ||
           (!url.pathname.includes('.') && !url.pathname.includes('/api/'));
}

function isDynamicContent(url) {
    return url.pathname.includes('/api/') ||
           url.pathname.includes('/data/') ||
           url.searchParams.has('dynamic');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'game-save') {
        event.waitUntil(syncGameData());
    }
    
    if (event.tag === 'settings-save') {
        event.waitUntil(syncSettings());
    }
});

async function syncGameData() {
    try {
        // Get pending game data from IndexedDB
        const gameData = await getStoredGameData();
        if (gameData) {
            // Try to sync with server
            const response = await fetch('/api/sync-game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameData)
            });
            
            if (response.ok) {
                // Clear stored data after successful sync
                await clearStoredGameData();
                console.log('[SW] Game data synced successfully');
            }
        }
    } catch (error) {
        console.error('[SW] Failed to sync game data:', error);
    }
}

async function syncSettings() {
    try {
        // Get pending settings from IndexedDB
        const settings = await getStoredSettings();
        if (settings) {
            // Try to sync with server
            const response = await fetch('/api/sync-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            
            if (response.ok) {
                // Clear stored data after successful sync
                await clearStoredSettings();
                console.log('[SW] Settings synced successfully');
            }
        }
    } catch (error) {
        console.error('[SW] Failed to sync settings:', error);
    }
}

// Push notifications for game events
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    const options = {
        body: 'Votre partie Undercover Premium vous attend !',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/index-premium.html'
        },
        actions: [
            {
                action: 'open',
                title: 'Ouvrir le jeu',
                icon: '/icon-play.png'
            },
            {
                action: 'dismiss',
                title: 'Plus tard',
                icon: '/icon-dismiss.png'
            }
        ]
    };
    
    if (event.data) {
        const data = event.data.json();
        options.body = data.message || options.body;
        options.data = { ...options.data, ...data };
    }
    
    event.waitUntil(
        self.registration.showNotification('Undercover Premium', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/index-premium.html')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(clearAllCaches());
    }
});

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('[SW] All caches cleared');
}

// IndexedDB helpers (simplified implementation)
async function getStoredGameData() {
    // Implementation would use IndexedDB to retrieve stored game data
    return null;
}

async function clearStoredGameData() {
    // Implementation would clear stored game data from IndexedDB
}

async function getStoredSettings() {
    // Implementation would use IndexedDB to retrieve stored settings
    return null;
}

async function clearStoredSettings() {
    // Implementation would clear stored settings from IndexedDB
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        const start = performance.now();
        
        event.respondWith(
            fetch(event.request).then((response) => {
                const duration = performance.now() - start;
                console.log(`[SW] API call to ${event.request.url} took ${duration.toFixed(2)}ms`);
                return response;
            })
        );
    }
});

console.log('[SW] Premium Service Worker loaded successfully');