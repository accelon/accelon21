import {registerServiceWorker} from './pwa.js';
registerServiceWorker();
import App from '../toolbox.svelte';
export default new App({target: document.body});