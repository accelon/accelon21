import render_default from '../render_default.svelte';
import render_cidian from '../render_cidian.svelte';
import render_toc from '../render_toc.svelte';
import {renderer} from './store.js'

export default render_default;
renderer.set({default:render_default,cidian:render_cidian,_toc:render_toc});