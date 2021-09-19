import main from './main.svelte';
import toolbox from './toolbox.svelte';

const App={toolbox,main}[document.location.search.substr(1)] || main;

export default new App({target: document.body});