import render_default from '../render_default.svelte';
import cidian from '../render_cidian.svelte';
import _toc from '../render_toc.svelte';
import _lines from '../render_lines.svelte';
import _collapse from '../render_collapse.svelte';
import {renderer} from './store.js'

export default render_default;
renderer.set({default:render_default, cidian,_toc,_lines,_collapse});