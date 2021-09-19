
const pool={}; //sharing pitaka across multiple content page
chrome.runtime.onMessage.addListener ((req,sender,sendResponse) => {
  if (req==='pool') sendResponse({pool});
  sendResponse(null);//suppress warning
});

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
    //   console.log('[Service Worker] Caching all: app shell and content');
        //required by PWA  
      // const cache = await caches.open(cacheName);
        // const response = await fetch('http://localhost:5001/index.html');
       // url without index.html
      // cache.put(response.url,response.clone());
      //console.log(cache)
      //  cache.put(response.url.replace('index.html',''),response);
    })());
});
/*
self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
      const r = await caches.match(e.request);
    //   console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) { return r; }
      const response = await fetch(e.request);
    //   console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      if (e.request.url.indexOf('livereload.js')==-1) {
          const cache = await caches.open(cacheName);
          cache.put(e.request, response.clone());
      }
      
      return response;
    })());
  });
  */