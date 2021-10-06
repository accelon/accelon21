import {registerServiceWorker} from './pwa.js';
registerServiceWorker();
import App from '../main.svelte';
export default new App({target: document.body});