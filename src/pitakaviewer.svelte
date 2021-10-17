<script>
import { openBasket } from 'pitaka';
import { onMount, tick , setContext} from 'svelte';
import { vstate,renderer, setLoc,searchbox } from './js/store.js';
import {scrollToHook} from './js/hook.js';
import VirtualScroll from './3rdparty/virtualscroll'
import ControlBar from './controlbar.svelte'
import { writable } from 'svelte/store';
import { parsePointer } from 'pitaka/offtext';
export let address='',tabid='';

// let toindex=0,systemsetting=false;
let vs,ptk={};
// $: vs&&vs.scrollToIndex(toindex)
const {basket,loc}=parsePointer(address);

const viewstore=writable({});

$: items=$viewstore.items||[];

setContext('viewstore',viewstore);
// $: items=$vline.items||[]; vs&&vs.scrollToOffset(0,items);

// $: vs&&vs.scrollToOffset(0,items.length)  //force scrolltotop when items changed
onMount(async ()=>{
    if (basket) {
        const p=await openBasket(basket);
        if (p) {
            ptk=p;
            await setLoc({ptk,loc},viewstore);
            await tick();
            // if ($vstate.hook) {
            //     const node=scrollToHook(ptk, $vstate.y, $vstate.hook);
            //     await tick();
            //     //scroll to LineMenu
            //     node&&node.previousElementSibling&&node.previousElementSibling.scrollIntoView();
            // }
        }
    }
});

</script>

<div class="container">
    <div><ControlBar {tabid}/></div>
    <svelte:component this={$searchbox[ptk.format]} {ptk}/>
    <VirtualScroll bind:this={vs} keeps={30} data={items} key="key" let:data>
        <svelte:component this={$renderer[ptk.format]||$renderer.default} {ptk} {...data}/>
    </VirtualScroll>
</div>

<style>
    .container {overflow:hidden;height:calc(100vh)}
</style>