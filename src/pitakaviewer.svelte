<script>
import { openBasket } from 'pitaka';
import { onMount, tick } from 'svelte';
import { vstate,vline,renderer, setLoc,searchbox } from './js/store.js';
import {scrollToHook} from './js/hook.js';
import VirtualScroll from './3rdparty/virtualscroll'
import ControlBar from './controlbar.svelte'
let ptk={};
let toindex=0,systemsetting=false;
let vs,ready=false;
$: vs&&vs.scrollToIndex(toindex)

$: items=$vline.items||[]; vs&&vs.scrollToOffset(0,items);
$: vs&&vs.scrollToOffset(0,items.length)  //force scrolltotop when items changed
onMount(async ()=>{
    if ($vstate.name) {
        
        const p=await openBasket($vstate.name);
        if (p) {
            ptk=p;
            await setLoc(ptk,$vstate.loc,$vstate.y,$vstate.hook);
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
    <div><ControlBar {ptk}/></div>
    <svelte:component this={$searchbox[ptk.format]} {ptk}/>
    <VirtualScroll  bind:this={vs} keeps={30} data={items} key="key" let:data>
        <svelte:component this={$renderer[ptk.format]||$renderer.default} {ptk} {...data}/>
    </VirtualScroll>
</div>

<style>
    .container {overflow:hidden}
</style>