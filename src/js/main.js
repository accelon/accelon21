import {registerServiceWorker} from './pwa.js';
import {loadconfig} from './loadconfig.js';
import App from '../main.svelte';


registerServiceWorker();

loadconfig(config=>{
    new App({target: document.body});
    if (!config.advance.keepLog) console.clear(); //clear the pitaka 404 message
});