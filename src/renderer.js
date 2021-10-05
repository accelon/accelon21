import toc from './render_toc.svelte';
import linetext from './render_text.svelte';

import {renderer} from './store.js'
const default_renderer={toc,linetext};
export default default_renderer;
renderer.set(default_renderer);

