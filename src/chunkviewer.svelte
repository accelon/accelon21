<script>
import { useBasket,ALIGNED_KEY } from 'pitaka';
import { setContext} from 'svelte';
import { _,tosim,palitrans,aligning} from './js/store.js';
import Render from './render_default.svelte';
import { aligntop} from './js/alignerstore.js';
import {getSeqColor} from './js/decorate.js'
import {loadChunkTraits,getOppositeActiveOffset, getOppositeAddress,chunkFromAddress, isParallel} from './js/addresses.js'
import VirtualScroll from './3rdparty/virtualscroll'
import ChunkBar from './chunkbar.svelte'
import { writable } from 'svelte/store';
import { parseAddress } from 'pitaka/offtext';
import LineMenu from './linemenu.svelte'
export let address='',side=0;
export let active=false;

let vscroll,ptk='',basket,loc,hook,dy,y0,y,locattrs,topkey, loaded=false, initial=true,
aligned='', alignedPitaka=[],optionalAlignedPitaka=[] ,mulu=[];
let parallels={}, chunkTraits={};
$: viewitems=chunkTraits.items ||[];

const init= async ()=>{
    const res = parseAddress(address);
    if (!res ) return;

    basket=res.basket; 
    ptk = useBasket(basket);
    if (ptk) {
        initial=loc!==res.loc;
        loc=res.loc;
        y=ptk.locY(loc)+res.dy;
        const page=chunkFromAddress(ptk,{loc,dy:res.dy});
        y0=page.y0;
        locattrs=res.attrs||{};
        aligned=(res[ALIGNED_KEY]||'').split(',');
        alignedPitaka=aligned.map(n=>useBasket(n)).filter(it=>!!it);
        optionalAlignedPitaka= (ptk.aligned&&ptk.aligned.filter( it=>!aligned.includes(it)&&useBasket(it).locY(loc)))||[];
    }
    chunkTraits = await loadChunkTraits({ptk,loc,hook,y0,dy,aligned});
    mulu=chunkTraits.mulu;
    setTimeout(()=>{
        scrollToY(y,true)
    },250);
}

$: init(address);

$: if (viewitems[0] && topkey !== viewitems[0].key) { //initial scroll
    vscroll.scrollToOffset(0) ;
    topkey=viewitems[0].key;
}
const vsSyncronize=(dis)=>{
    const yoffset=vscroll.getIndexOffset(y-y0) - vscroll.getOffset();
    const delta=yoffset - dis;
    if (Math.abs(delta)>500) vscroll.scrollToOffset( vscroll.getOffset() + delta );
}
$: if(active&&viewitems.length) {
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

let scrollStart=0;
const scroll=(evt)=>{
    scrollStart=evt.detail.index;
}
const scrollToY=(y,force=false)=>{
    //if (!vscroll || ($vstore.filterfunc && !force) ) return;
    if (!viewitems.length) {
        vscroll.scrollToOffset(0) ;
        return;
    }
    const yoffset=vscroll.getIndexOffset(y-y0);
    const startoffset=vscroll.getOffset();
    const endoffset=startoffset+vscroll.getClientSize();
    if (yoffset>startoffset && yoffset<endoffset) return;

    for (let i=0;i < viewitems.length;i++) {
        if (viewitems[i].key>=y) {
            vscroll.scrollToIndex(i,true);
            break;
        }
    }
}
</script>
<div class="container">
    <div><ChunkBar {side} {scrollStart} {ptk} {y0} {mulu} {loc} {scrollToY}/></div>
    <VirtualScroll start={-1} bind:this={vscroll} keeps={30}  height="calc(100% - 1.5em)" data={viewitems} 
        key="key" let:data on:scroll={scroll}>
        <Render master=true {...data} {y0} activeline={data.key==y} lang={ptk.langOf(y)} {loc} {ptk} {side} >
        {#if data.key===y}<LineMenu {y0} {side} {loc} activeline={data.key==y}
            lang={ptk.langOf(y)} y={data.y||data.key} {ptk} bind:parallels aligned={optionalAlignedPitaka}/>{/if}
        </Render>            

        {#each alignedPitaka as aptk,idx}
        <Render y={aptk.alignedY(data.key,ptk)}  y0={aptk.alignedY(y0,ptk)} 
            activeline={data.key==y } 
            activelinecolor={data.key==y && idx+1}
            lang={aptk.langOf(aptk.alignedY(data.key,ptk))} ptk={aptk} {side}>
            <span slot='start' class='clickable alignedName' style={"color:"+getSeqColor(idx+1)} title={_(aptk.langOf(aptk.alignedY(data.key,ptk)),aptk.header.title,$tosim,$palitrans)}>{aptk.name}</span>
        </Render>
        {/each}            
    </VirtualScroll>
</div>
<style>
    :global(.container) {overflow:hidden;height:100vh}
</style>