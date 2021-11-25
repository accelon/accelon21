<script>
import { useBasket } from 'pitaka';
import { setContext} from 'svelte';
import { renderer } from './js/store.js';
import {setLoc} from './js/addresses.js'
import VirtualScroll from './3rdparty/virtualscroll'
import PageBar from './pagebar.svelte'
import { writable } from 'svelte/store';
import { parseAddress } from 'pitaka/offtext';
import {filterItems} from './js/criteria.js';
export let address='',side=0;
export let active=false;
let vscroll,ptk='',basket,loc,hook,dy,y0,locattrs,topkey, loaded=false;

const vstore=writable({renderer,criteria:{},filterfunc:null,linetofind:''});
const viewitems=writable({});
setContext('vstore',vstore);
setContext('viewitems',viewitems);

$: {const res = parseAddress(address) ; if (res) {
    basket=res.basket; 
    ptk = useBasket(basket);
    if (ptk) {
        loc=res.loc;
        y0=ptk.getPageRange(loc)[0];
        locattrs=res.attrs||{};
        $vstore.linetofind=locattrs.ltf||'';
        loaded=false
    }
}}
$: usernotes=$vstore.usernotes;
$: bookmarks=$vstore.bookmarks;

$: viewitems.set( filterItems(ptk,$vstore,$vstore.filterfunc)||[] );
$: if ($viewitems[0] && topkey !== $viewitems[0].key) { //initial scroll
    vscroll.scrollToOffset(0) ;
    topkey=$viewitems[0].key;
}
$: if(active&&$viewitems.length) {
    setTimeout(()=>{
        if (vscroll.getIndexOffset(dy) > vscroll.getOffset()+vscroll.getClientSize()){
        scrollToY(y0+dy,true);
        }
    },10)
}

$: if ((!loaded && ptk && vscroll) ) { 
    setLoc({ptk,loc,hook,y0,dy},vstore);
    loaded=true
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

    for (let i=0;i < $viewitems.length;i++) {
        if ($viewitems[i].key>=y) {
            vscroll.scrollToIndex(i,true);
            break;
        }
    }
}
$vstore.scrollToY=scrollToY;

</script>
<div class="container">
    <div><PageBar {side} {scrollStart} {ptk}/></div>
    <VirtualScroll start={-1} bind:this={vscroll} keeps={30} data={$viewitems} 
        key="key" let:data on:scroll={scroll}>
        {#if data.ptr}
        <svelte:component this={$renderer._toc} {ptk} {...data}/>
        {:else}
        <svelte:component this={data.renderer||$renderer[ptk.format]||$renderer.default}
            {...data} {y0} activeline={data.key==y0+dy} 
            {usernotes} linetofind={$vstore.linetofind} {bookmarks}  {loc} {ptk} {side}
        />
        {/if}
    </VirtualScroll>
</div>

<style>
    :global(.container) {overflow:hidden;height:100vh}
</style>