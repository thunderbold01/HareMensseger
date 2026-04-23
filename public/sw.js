// Service Worker para Push Notifications
const CACHE_NAME = 'secure-messaging-v1';

self.addEventListener('install', (event) => {
  console.log('📲 Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('📲 Service Worker activated');
  event.waitUntil(clients.claim());
});

// Push Notification
self.addEventListener('push', function(event) {
  console.log('📩 Push notification received');
  
  let data = {};
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    data = { head: 'Nova mensagem', body: 'Você tem uma nova mensagem' };
  }
  
  const title = data.head || 'Nova mensagem';
  const options = {
    body: data.body || 'Você tem uma nova mensagem',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(windowClients => {
          for (let client of windowClients) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});