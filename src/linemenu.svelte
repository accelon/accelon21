<script>


// import {vstate} from './js/addresses.js';
import Parallel from './renderer_parallel.svelte'
export let y;
export let y0;
export let side=0;
export let ptk;
export let loc;

let links=[];
$: links=ptk.getParallelLinks(y);
</script>
<span class='linemenu'>{#each links as {par,loc}}<Parallel {ptk} {side} dy={y-y0} caption={par} {par} {loc} />{/each}</span>
