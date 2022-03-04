<script>
import { useBasket } from 'pitaka';

// import {vstate} from './js/addresses.js';
import Parallel from './renderer_parallel.svelte'
export let y;
export let y0;
export let side=0;
export let ptk;
export let loc;
export let aligned=[];

$: alignedPtk=aligned.map(it=>useBasket(it)).filter(it=>!!it);

</script>
<span class='linemenu'>{#each alignedPtk as aptk} <Parallel ptk={aptk} {loc}{y}/> {/each}</span>
