import {registerServiceWorker} from 'kaigua';
registerServiceWorker();
import App from './main.svelte';
export default new App({target: document.body});