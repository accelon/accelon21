<script>
import { onMount } from "svelte";
import {renderer} from './js/store';
import {newopposite} from './js/addresses'
import Btn from './comps/button.svelte';
export let loc;
export let ptk;
export let side=0;
export let caption;
let showing=false;
let [y0] = ptk.getPageRange( ptk.pageLoc(loc));
const dy=ptk.dyOf(loc);
let text='',y;
onMount(async ()=>{
    [y,text]=(await ptk.readLines(y0+dy,1))[0]
});
const openParallel=()=>{
    newopposite(side,ptk.name+'/'+loc);
}
</script>
{#if showing}
<svelte:component nesting={1} this={$renderer.default} {text} {loc}>
 <Btn icon='read' onclick={openParallel} />
</svelte:component>
{:else}
<span class='btnparallel clickable' on:click={()=>showing=true} >{caption}</span>
{/if}

