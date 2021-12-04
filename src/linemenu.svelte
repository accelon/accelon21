<script>
// import {vstate} from './js/addresses.js';
import Parallel from './renderer_parallel.svelte'
export let y;
export let side=0;
export let ptk;
export let loc;
let links=[];
$: links=ptk.getParallelLinks(y);
</script>
<span class='linemenu'>
{#each links as {par,loc}}
<Parallel {ptk} {side} caption={par} {loc}/>
{/each}
</span>