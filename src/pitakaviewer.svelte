<script>
import { useBasket } from 'pitaka';
import { getContext, setContext} from 'svelte';
import { renderer } from './js/store.js';
import {setLoc,setDy, getActiveline} from './js/addresses.js'
import {scrollToHook} from './js/hook.js';
import VirtualScroll from './3rdparty/virtualscroll'
import ControlBar from './controlbar.svelte'
import { writable } from 'svelte/store';
import { parsePointer } from 'pitaka/offtext';
import {matchTofind} from './js/criteria.js';
export let address='',side=0;
export let visible=false;

let vs,ptk='';
const viewstore=writable({renderer,criteria:{},linetofind:'',filteron:false});
setContext('viewstore',viewstore);
const addresses=getContext('addresses');
let {basket,loc,dy,hook,y0} =parsePointer(address);

$: ptk = useBasket(basket);
$: res = parsePointer(address) ; if (res) {basket=res.basket; loc=res.loc;}
// $: vs&&dy&&vs.scrollToIndex(dy)

$: ptk&&visible?setLoc({ptk,loc,hook,y0,dy},viewstore):
    setTimeout(()=>setLoc({ptk,loc,hook,y0,dy},viewstore),1000);
$: usernotes=$viewstore.usernotes;
$: y0=$viewstore.y0; 
$: linetofind =$viewstore.linetofind;
$: items=matchTofind(ptk,$viewstore.items,$viewstore.linetofind,$viewstore.filteron)||[];
$: if (vs && activeline&&items.length&&!$viewstore.filteron) {
    vs.scrollToIndex(0,$viewstore.filteron);
    setTimeout(()=>{
        scrollToY(activeline); 
    },10);
}


let scrollStart=0;
const scroll=(evt)=>{
    scrollStart=evt.detail.index;
}
const scrollToY=y=>{
    for (let i=0;i<items.length;i++) {
        if (items[i].key>=y) {
            vs.scrollToIndex(i);
            break;
        }
    }
}
const scrollTo=({detail})=>{
    if (detail.y) {
        const y=parseInt(detail.y);
        vs.scrollToIndex(y-$viewstore.y0);
    }
}
let activeline=getActiveline(addresses);
const onactiveline=({detail})=>{
    setDy(addresses,detail);
    activeline=detail+y0;
}
</script>
<div class="container">
    <div><ControlBar  {scrollStart} {ptk} on:scrollTo={scrollTo}/></div>
    <VirtualScroll start={-1} bind:this={vs} keeps={30} data={items} key="key" let:data on:scroll={scroll}>
        {#if data.ptr}
        <svelte:component this={$renderer._toc} {ptk} {...data}/>
        {:else}
        <svelte:component this={$renderer[data.renderer]||$renderer[ptk.format]||$renderer.default}
            on:activeline={onactiveline}
            active={activeline==data.key}
            {...data} {y0} {usernotes} {linetofind} {loc} {ptk} {side}
        />
        {/if}
    </VirtualScroll>
</div>

<style>
    .container {overflow:hidden;height:100vh}
</style>