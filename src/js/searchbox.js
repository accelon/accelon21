import cidian from '../searchbox_cidian.svelte';
import toc from '../searchbox_toc.svelte';
import {searchbox} from './store.js'
searchbox.set({cidian,toc});

export default {};