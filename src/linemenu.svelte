<script>
import { useBasket } from 'pitaka';
import PaliMenu from './palimenu.svelte'
import Parallel from './renderer_parallel.svelte'
export let y=0,side=0, ptk,loc='',y0=0,lang;
export let aligned=[];

$: alignedPtk=aligned.map(it=>useBasket(it)).filter(it=>!!it);
$: y,side,ptk,y0;
$: dy=y-ptk.locY(loc);
</script>

<span class='linemenu'>{#each alignedPtk as aptk} <Parallel ptk={aptk} alignptk={ptk} {loc} {dy} /> {/each}{#if lang=='pl'}<PaliMenu/>{/if}</span>
