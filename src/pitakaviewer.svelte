<script>
import { useBasket } from 'pitaka';
import { getContext, setContext} from 'svelte';
import { renderer } from './js/store.js';
import {setLoc} from './js/addresses.js'
import VirtualScroll from './3rdparty/virtualscroll'
import ControlBar from './controlbar.svelte'
import { writable } from 'svelte/store';
import { parsePointer } from 'pitaka/offtext';
import {matchTofind} from './js/criteria.js';
import {getActivelineStore} from './js/addresses.js';
export let address='',side=0;
export let visible=false;

let vs,ptk='',basket,loc,hook,dy,y0;
const viewstore=writable({renderer,criteria:{},linetofind:'',filteron:false});
setContext('viewstore',viewstore);
const addresses=getContext('addresses');
// let {basket,loc,dy,hook,y0} =parsePointer(address);

const activeline=getActivelineStore(addresses);
$: {const res = parsePointer(address) ; if (res) {
    basket=res.basket; 
    ptk = useBasket(basket);
    loc=res.loc; 
    dy=res.dy;
}}

$: ptk&&visible?setLoc({ptk,loc,hook,y0,dy},viewstore):
    setTimeout(()=>setLoc({ptk,loc,hook,y0,dy},viewstore),1000);
$: usernotes=$viewstore.usernotes;
$: bookmarks=$viewstore.bookmarks;
$: linetofind =$viewstore.linetofind;
$: if(ptk&&vs&&($viewstore.y0)) { //initial scroll
    if ($viewstore.y0!==y0) {
        y0=$viewstore.y0; 
        activeline.set(y0+dy); //dy is taken from url, use setActiveline to update url
        if (vs.getIndexOffset(dy) > vs.getOffset()+vs.getClientSize()) {
            setTimeout(()=>scrollToY($activeline),0);
            console.log('scrolltoY')
        }
    }
}
$: items=matchTofind(ptk,$viewstore.items,$viewstore.linetofind,$viewstore.filteron)||[];
$: if (vs && items.length&&!$viewstore.filteron) {
    if ($viewstore.linetofind){ //come back from filter mode
        scrollToY( $activeline ); 
    }
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