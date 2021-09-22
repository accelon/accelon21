import {registerServiceWorker} from 'kaigua';
registerServiceWorker();
import App from './toolbox.svelte';
export default new App({target: document.body});