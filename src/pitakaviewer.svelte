<script>
import { useBasket } from 'pitaka';
import { getContext, setContext} from 'svelte';
import { renderer } from './js/store.js';
import {setLoc} from './js/addresses.js'
import VirtualScroll from './3rdparty/virtualscroll'
import ControlBar from './controlbar.svelte'
import { writable } from 'svelte/store';
import { parsePointer } from 'pitaka/offtext';
import {filterItems} from './js/criteria.js';
import {getActivelineStore} from './js/addresses.js';
export let address='',side=0;
export let visible=false;

let vscroll,ptk='',basket,loc,hook,dy,y0,locattrs,topkey;

const vstore=writable({renderer,criteria:{},filterfunc:null,linetofind:''});
const viewitems=writable({});
setContext('vstore',vstore);
setContext('viewitems',viewitems);
const addresses=getContext('addresses');

const activeline=getActivelineStore(addresses);
$: {const res = parsePointer(address) ; if (res) {
    basket=res.basket; 
    ptk = useBasket(basket);
    loc=res.loc; 
    dy=res.dy;
    locattrs=res.attrs||{};
    $vstore.linetofind=locattrs.ltf||'';
}}


$: ptk&&visible?setLoc({ptk,loc,hook,y0,dy},vstore):
    setTimeout(()=>setLoc({ptk,loc,hook,y0,dy},vstore),1000);
$: usernotes=$vstore.usernotes;
$: bookmarks=$vstore.bookmarks;

$: if(vscroll&&ptk&&($vstore.y0)) { //initial scroll
    if ($vstore.y0!==y0) {
        y0=$vstore.y0; 
        activeline.set(y0+dy); //dy is taken from url, use setActiveline to update url
        if (vscroll.getIndexOffset(dy) > vscroll.getOffset()+vscroll.getClientSize()) {
            setTimeout(()=>scrollToY($activeline),0);
        }
    }
}
$: viewitems.set( filterItems(ptk,$vstore,$vstore.filterfunc)||[] );
$: if ($viewitems[0] && topkey !== $viewitems[0].key) {
    vscroll.scrollToOffset(0) ;
    topkey=$viewitems[0].key;
}
let scrollStart=0;
const scroll=(evt)=>{
    scrollStart=evt.detail.index;
}
const scrollToY=(y,force=false)=>{
    if (!vscroll || ($vstore.filterfunc && !force) ) return;
    if (!$viewitems.length) {
        vscroll.scrollToOffset(0) ;
        return;
    }
    const yoffset=vscroll.getIndexOffset(y-y0);
    const startoffset=vscroll.getOffset();
    const endoffset=startoffset+vscroll.getClientSize();
    if (yoffset>startoffset && yoffset<endoffset) return;

    for (let i=0;i<$viewitems.length;i++) {
        if ($viewitems[i].key>=y) {
            vscroll.scrollToIndex(i,true);
            break;
        }
    }
}
$vstore.scrollToY=scrollToY;

</script>
<div class="container">
    <div><ControlBar  {scrollStart} {ptk}/></div>
    <VirtualScroll start={-1} bind:this={vscroll} keeps={30} data={$viewitems} key="key" let:data on:scroll={scroll}>
        {#if data.ptr}
        <svelte:component this={$renderer._toc} {ptk} {...data}/>
        {:else}
        <svelte:component this={data.renderer||$renderer[ptk.format]||$renderer.default}
            {...data} {y0} {usernotes} linetofind={$vstore.linetofind} {bookmarks}  {loc} {ptk} {side}
        />
        {/if}
    </VirtualScroll>
</div>

<style>
    .container {overflow:hidden;height:100vh}
</style>