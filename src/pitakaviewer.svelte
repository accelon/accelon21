<script>
import { openBasket } from 'pitaka';
import { onMount } from 'svelte';
import { vstates,renderer } from './store.js';
import RenderToc from './render_toc.svelte';
import RenderText from './render_text.svelte';
import VirtualScroll from 'svelte-virtual-scroll-list'
import ControlBar from './controlbar.svelte'
export let col=0;
let ptk={},vs;
const vstate=vstates[col];
let items=[], tree='',render=RenderText;
const onscroll=({detail})=>{
    ptk.prefetchLines(detail.start, detail.end-detail.start );
}
onMount(async ()=>{
    renderer.set({RenderToc,RenderText});
    if ($vstate.name) {
        const p=await openBasket($vstate.name);
        if (p) {
            ptk=p;
            vstate.set(Object.assign($vstate,{ptk}));
            items=ptk.getTree();
            render=RenderToc;
        }
    }
});
const updateItems=(_items,_tree)=>{
    items=_items;
    tree=_tree;
}
</script>

<div class="container">
    <ControlBar col={col} {updateItems} {tree}/>
    <VirtualScroll on:scroll={onscroll} bind:this={vs} keeps={40} data={items} key="key" let:data>
        <svelte:component this={render} {ptk} {...data} {updateItems}/>
    </VirtualScroll>
</div>

<style>
    .container {height:calc(100vh - 2em);  }
</style>