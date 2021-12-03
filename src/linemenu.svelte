<script>
// import {vstate} from './js/addresses.js';
import Parallel from './renderer_parallel.svelte'
export let y;
export let ptk;
export let loc;
let links=[];
$: links=ptk.getParallelLinks(y);
</script>
<span class='linemenu'>
{#each links as [caption,basket,loc]}
<Parallel {ptk} {caption} {loc}/>
{/each}
</span>