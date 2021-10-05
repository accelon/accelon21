<script>
import { openBasket } from 'pitaka';
import { onMount } from 'svelte';
import { vstates,renderer } from './store.js';

import VirtualScroll from 'svelte-virtual-scroll-list'
import ControlBar from './controlbar.svelte'
export let col=0;
let ptk={},vs;
const vstate=vstates[col];
$: items=$vstate.items||[]; vs&&vs.scrollToOffset(0,items);
$: vs&&vs.scrollToOffset(0,items.length)  //force scrolltotop when items changed
onMount(async ()=>{
    if ($vstate.name) {
        const p=await openBasket($vstate.name);
        if (p) {
            ptk=p;
            const items=ptk.fetch($vstate.address);
            await ptk.prefetchLines(items[0].key,items.length);
            vstate.set(Object.assign($vstate,{ptk,items}));
        }
    }
});

</script>

<div class="container">
    <ControlBar {ptk} col={col}/>
    <VirtualScroll  bind:this={vs} keeps={40} data={items} key="key" let:data>
        <svelte:component col={col} this={$renderer.linetext} {ptk} {...data}/>
    </VirtualScroll>
</div>

<style>
    .container {height:calc(100vh - 2em);  }
</style>