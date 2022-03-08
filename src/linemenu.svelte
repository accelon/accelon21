<script>
import { useBasket } from 'pitaka';

import Parallel from './renderer_parallel.svelte'
export let y=0,side=0, ptk,loc='',y0=0;
export let aligned=[];

$: alignedPtk=aligned.map(it=>useBasket(it)).filter(it=>!!it);
$: y,side,ptk,y0;
</script>

<span class='linemenu'>{#each alignedPtk as aptk} <Parallel ptk={aptk} {loc}{y}/> {/each}</span>
