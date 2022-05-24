import render_default from '../render_default.svelte';
import _lines from '../render_lines.svelte';
import {renderer} from './store.js'

export default render_default;
renderer.set({default:render_default,_lines});