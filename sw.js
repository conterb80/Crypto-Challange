const CACHE = 'crypto-conte-rc8-training-20261005-v1';
const APP = ['./','index.html','style.css?v=2.8.0','app.js?v=2.8.0','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP))); });
self.addEventListener('activate', e => { e.waitUntil((async()=>{ for (const k of await caches.keys()) if(k!==CACHE) await caches.delete(k); await self.clients.claim(); })()); });
self.addEventListener('fetch', e => {
  if(e.request.method!=='GET') return;
  const url = new URL(e.request.url);
  if(url.origin!==location.origin) return;
  e.respondWith((async()=>{
    try {
      const net = await fetch(e.request);
      const cache = await caches.open(CACHE);
      cache.put(e.request, net.clone());
      return net;
    } catch (_) {
      return (await caches.match(e.request)) || (await caches.match('./'));
    }
  })());
});
