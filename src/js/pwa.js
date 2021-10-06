export function registerServiceWorker(swfn="./sw.js"){
    const p=document.location.protocol;
    const h=document.location.hostname;
    const localhost= p=='http:' && (h=='127.0.0.1' || h=='localhost');
    if ("serviceWorker" in navigator && (localhost||p=='https:') ) {
      navigator.serviceWorker.register(swfn);
    }
}
  