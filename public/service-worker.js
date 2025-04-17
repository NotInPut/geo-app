const CACHE_NAME = 'siteSpotter-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons.svg',
  '/src/index.css',
  '/src/App.css'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then(response => {
            // Only cache successful responses
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          });
      })
      .catch(() => {
        // Return offline fallback
        return new Response('Offline - Unable to load content', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// Handle sync events for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
});

async function syncReports() {
  try {
    const queue = JSON.parse(localStorage.getItem('sync_queue') || '[]');

    // Process each item in the queue
    for (const item of queue) {
      console.log('Processing queued report:', item.data);
    
    }

    // Clear the queue after processing
    localStorage.setItem('sync_queue', JSON.stringify([]));
  } catch (error) {
    console.error('Sync failed:', error);
  }
}