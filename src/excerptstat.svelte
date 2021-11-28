<script>
import {writable } from "svelte/store";
import VirtualScroll from './3rdparty/virtualscroll';
import {_,tosim} from './js/store.js';
export let excerpts=[];
export let ptk;
export let side=0;
export let filterclusters={};
let showing=true;
let stats=writable([]);

const setshowmode=()=>showing=!showing;
const statByCluster=()=>{
    const byBook={};
    for (let i=0;i<excerpts.length;i++) {
        const ex=excerpts[i];
        if (!byBook[ex.ncl]) byBook[ex.ncl]=0;
        byBook[ex.ncl]++;
    }
    const out=[];
    for (let bk in byBook) out.push([bk,byBook[bk]]);
    out.sort((a,b)=>b[1]-a[1]);
    
    const cl=ptk.getClusterLabel();
    return out.map((it,idx)=> {return {idx,key:it[0],selected:true, name:cl.names[it[0]], count:it[1] }} )
}
const selectAll=(_stats,onoff)=>{
    for (let i=0;i<_stats.length;i++) {
        _stats[i].selected=onoff;
    }
}

let selectedBookCount=0;
const updateFilter=()=>{
    filterclusters={};
    const books=$stats.filter(it=>it.selected).map(it=>it.key);
    selectedBookCount=0;
    for (let i=0;i<books.length;i++) {
        filterclusters[books[i]]=true;
        selectedBookCount++;
    }
}
const toggleInclusive=evt=>{
    const _stats=$stats;
    const idx=parseInt(evt.target.attributes.idx.value);
    if (selectedBookCount==1 && _stats[idx].selected) {
        selectAll(_stats,true);
    } else {
        selectAll(_stats,false);
    }
    _stats[idx].selected=!_stats[idx].selected;
    stats.set(_stats);
    updateFilter();
}
const toggleSelect=evt=>{
    const _stats=$stats;
    const idx=parseInt(evt.target.attributes.idx.value);
    _stats[idx].selected=!_stats[idx].selected;
    stats.set(_stats);
    updateFilter();
}
$: stats.set(statByCluster(excerpts));
</script>
<span class="hamburger" class:showing on:click={setshowmode}>☰</span>
{#if showing}
<div  class="dropdownpanel stats">
<VirtualScroll keeps={30} data={$stats} key="key" let:data>
<div class="statitem">
    <span on:click={toggleInclusive} idx={data.idx} class="clickable" class:selected={data.selected}>
        {_(data.name,$tosim)}
    </span>
    <span on:click={toggleSelect} idx={data.idx} class="clickable count">
        {data.count}
    </span>
</div>
</VirtualScroll>
</div>
{/if}
<style>
.stats {height:25em}
.statitem{padding-left:5px}
.selected {color:var(--highlight)}
.count {padding-left:5px;padding-right:5px}
</style>
