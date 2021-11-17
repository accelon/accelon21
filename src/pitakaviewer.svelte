<script>
import { useBasket } from 'pitaka';
import { getContext, setContext} from 'svelte';
import { renderer } from './js/store.js';
import {setLoc,} from './js/addresses.js'
import {scrollToHook} from './js/hook.js';
import VirtualScroll from './3rdparty/virtualscroll'
import ControlBar from './controlbar.svelte'
import { writable } from 'svelte/store';
import { parsePointer } from 'pitaka/offtext';
import {matchTofind} from './js/criteria.js';
import {getActivelineStore} from './js/addresses.js';
export let address='',side=0;
export let visible=false;

let vs,ptk='';
const viewstore=writable({renderer,criteria:{},linetofind:'',filteron:false});
setContext('viewstore',viewstore);
const addresses=getContext('addresses');
let {basket,loc,dy,hook,y0} =parsePointer(address);
const activeline=getActivelineStore(addresses);
$: ptk = useBasket(basket);
$: res = parsePointer(address) ; if (res) {basket=res.basket; loc=res.loc;}
// $: vs&&dy&&vs.scrollToIndex(dy)

$: ptk&&visible?setLoc({ptk,loc,hook,y0,dy},viewstore):
    setTimeout(()=>setLoc({ptk,loc,hook,y0,dy},viewstore),1000);
$: usernotes=$viewstore.usernotes;
$: bookmarks=$viewstore.bookmarks;
$: y0=$viewstore.y0; 
$: linetofind =$viewstore.linetofind;
$: items=matchTofind(ptk,$viewstore.items,$viewstore.linetofind,$viewstore.filteron)||[];
$: if (vs && items.length&&!$viewstore.filteron && $viewstore.linetofind) {
    vs.scrollToIndex(0,$viewstore.filteron);
    setTimeout(()=>{
        scrollToY( $activeline ); 
    },10);
}


let scrollStart=0;
const scroll=(evt)=>{
    scrollStart=evt.detail.index;
}
const scrollToY=y=>{
    for (let i=0;i<items.length;i++) {
        if (items[i].key>=y) {
            vs.scrollToIndex(i,true);
            break;
        }
    }
}
const scrollTo=({detail})=>{
    if (detail.y) {
        const y=parseInt(detail.y);
        vs.scrollToIndex(y-$viewstore.y0,true);
    }
}

</script>
<div class="container">
    <div><ControlBar  {scrollStart} {ptk} on:scrollTo={scrollTo}/></div>
    <VirtualScroll start={-1} bind:this={vs} keeps={30} data={items} key="key" let:data on:scroll={scroll}>
        {#if data.ptr}
        <svelte:component this={$renderer._toc} {ptk} {...data}/>
        {:else}
        <svelte:component this={$renderer[data.renderer]||$renderer[ptk.format]||$renderer.default}
            {...data} {y0} {usernotes} {bookmarks} {linetofind} {loc} {ptk} {side}
        />
        {/if}
    </VirtualScroll>
</div>

<style>
    .container {overflow:hidden;height:100vh}
</style>