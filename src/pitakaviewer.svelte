<script>
import { openBasket } from 'pitaka';
import { onMount, tick } from 'svelte';
import { vstates,vlines,renderer, setLoc,searchbox } from './js/store.js';
import {scrollToHook} from './js/hook.js';
import VirtualScroll from 'svelte-virtual-scroll-list'
import ControlBar from './controlbar.svelte'
export let col=0;
let ptk={},vs;
const vstate=vstates[col];
const vl=vlines[col];
$: items=$vl.items||[]; vs&&vs.scrollToOffset(0,items);
$: vs&&vs.scrollToOffset(0,items.length)  //force scrolltotop when items changed
onMount(async ()=>{
    if ($vstate.name) {
        const p=await openBasket($vstate.name);
        if (p) {
            ptk=p;
            await setLoc(ptk,col,$vstate.loc,$vstate.y,$vstate.hook);
            await tick();
            if ($vstate.hook) {
                const node=scrollToHook(ptk, $vstate.y, $vstate.hook);
                await tick();
                //scroll to LineMenu
                node&&node.previousElementSibling&&node.previousElementSibling.scrollIntoView();
            }
        }
    }
});

</script>

<div class="container">
    <ControlBar {ptk} {col}/>
    <svelte:component this={$searchbox[ptk.format]} {ptk} {col}/>
    <VirtualScroll  bind:this={vs} keeps={40} data={items} key="key" let:data>
        <svelte:component col={col} this={$renderer[ptk.format]||$renderer.default} {ptk} {...data}/>
    </VirtualScroll>
</div>

<style>
    .container {height:calc(100vh - 2em);  }
</style>