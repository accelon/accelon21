<script>
import { useBasket } from 'pitaka';
import { setContext} from 'svelte';
import { renderer ,_,tosim,aligning} from './js/store.js';
import { aligntop} from './js/alignerstore.js';
import {getSeqColor} from './js/decorate.js'
import {setLoc,getOppositeActiveOffset, getOppositeAddress,chunkFromAddress, isParallel} from './js/addresses.js'
import VirtualScroll from './3rdparty/virtualscroll'
import ChunkBar from './chunkbar.svelte'
import { writable } from 'svelte/store';
import { parseAddress } from 'pitaka/offtext';
import {filterItems} from './js/criteria.js';
import LineMenu from './linemenu.svelte'
export let address='',side=0;
export let active=false;
let vscroll,ptk='',basket,loc,hook,dy,y0,y,locattrs,topkey, loaded=false, initial=true,
aligned='', alignedPitaka=[],optionalAlignedPitaka=[];
const vstore=writable({renderer,criteria:{},filterfunc:null,linetofind:'',parallels:{}});
const viewitems=writable({});
setContext('vstore',vstore);
setContext('viewitems',viewitems);
$: {const res = parseAddress(address) ; if (res) {
    basket=res.basket; 
    ptk = useBasket(basket);
    if (ptk) {
        initial=loc!==res.loc;
        loc=res.loc;
        y=ptk.locY(loc)+res.dy;
        const page=chunkFromAddress(ptk,{loc,dy:res.dy});
        y0=page.y0;
        locattrs=res.attrs||{};
        aligned=(res.al||'').split(',');
        alignedPitaka=aligned.map(n=>useBasket(n)).filter(it=>!!it);
        optionalAlignedPitaka= (ptk.aligned&&ptk.aligned.filter( it=>!aligned.includes(it)&&useBasket(it).locY(loc)))||[];
        $vstore.linetofind=locattrs.ltf||'';
        if (initial) loaded=false
    }
}}
$: usernotes=$vstore.usernotes;
$: bookmarks=$vstore.bookmarks;

$: viewitems.set( filterItems(ptk,$vstore,$vstore.filterfunc)||[] );
$: if ($viewitems[0] && topkey !== $viewitems[0].key) { //initial scroll
    vscroll.scrollToOffset(0) ;
    topkey=$viewitems[0].key;
}
const vsSyncronize=(dis)=>{
    const yoffset=vscroll.getIndexOffset(y-y0) - vscroll.getOffset();
    const delta=yoffset - dis;
    vscroll.scrollToOffset( vscroll.getOffset() + delta );
}
$: if(active&&$viewitems.length) {
    setTimeout(()=>{
        if (vscroll.getIndexOffset(dy) > vscroll.getOffset()+vscroll.getClientSize()){
            scrollToY(y0+dy,true);
        }
        //line in view port adjust offset
        if (side==1) { //only side from left to right
            if (isParallel( getOppositeAddress(), address)) {
                const layerY=getOppositeActiveOffset(side);
                vsSyncronize(layerY);
            }
        } else if ($aligning) {
            vsSyncronize($aligntop);
        }
    },10)
}

$: if ((!loaded && ptk && vscroll) ) { 
    setLoc({ptk,loc,hook,y0,dy,aligned},vstore);
    if (initial) {
        setTimeout(()=>{
            scrollToY(y,true)
        },250);
    }
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
    <div><ChunkBar {side} {scrollStart} {ptk}/></div>
    <VirtualScroll start={-1} bind:this={vscroll} keeps={30}  height="calc(100% - 1.5em)" data={$viewitems} 
        key="key" let:data on:scroll={scroll}>
        {#if data.ptr}
        <svelte:component this={$renderer._toc} {ptk} {...data}/>
        {:else}
            <svelte:component this={data.renderer||$renderer[ptk.format]||$renderer.default}
                master=true {...data} {y0}  activeline={data.key==y} lang={ptk.langOf(y)}
                {usernotes} linetofind={$vstore.linetofind} {bookmarks}  {loc} {ptk} {side}
            >
            {#if data.key===y}<LineMenu {y0} {side} {loc} lang={ptk.langOf(y)} y={data.y||data.key} {ptk} aligned={optionalAlignedPitaka}/>{/if}
            </svelte:component>            
            {#each alignedPitaka as aptk,idx}
            <svelte:component this={data.renderer||$renderer[ptk.format]||$renderer.default}
                y={aptk.alignedY(data.key,ptk)}  y0={aptk.alignedY(y0,ptk)} 
                activeline={data.key==y } 
                activelinecolor={data.key==y && idx+1}
                lang={aptk.langOf(aptk.alignedY(data.key,ptk))} ptk={aptk} {side}>
                <span slot='start' class='clickable alignedName' style={"color:"+getSeqColor(idx+1)} title={_(aptk.header.title,$tosim)}>{aptk.name}</span>
            </svelte:component>
            {/each}            
        {/if}
        
    </VirtualScroll>
</div>

<style>
    :global(.container) {overflow:hidden;height:100vh}
</style>