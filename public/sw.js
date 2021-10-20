const cacheName = 'cache';

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    // e.waitUntil((async () => {
    // //   console.log('[Service Worker] Caching all: app shell and content');
    //     //required by PWA  
    //    const cache = await caches.open(cacheName);
    //    const response = await fetch('index.html');
    //    // url without index.html
    //   cache.put(response.url,response.clone());
    //   //  cache.put(response.url.replace('index.html',''),response);
    // })());
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      if (navigator.onLine || e.request.url.indexOf('http://localhost')==0) {
        const response=await fetch(e.request);
        const lastmodified=Date.parse(response.headers.get('last-modified'));

        const r = await caches.match(e.request);

        let updatecache=false;
        if (r) { //found in cache, check if older
          const cachemodified=Date.parse(r.headers.get('last-modified'));
          if (lastmodified>cachemodified) updatecache=true;
        } else updatecache=true;
        if (e.request.url.indexOf('livereload.js')>0
         || e.request.url.indexOf('.ptk')>0) updatecache=false;

        if (updatecache) {
          const cache = await caches.open(cacheName);
          cache.put(e.request, response.clone());
        }      
        return response;
      } else {
        const r = await caches.match(e.request);
        if (r) { return r; }  
    }
  })());
});