<script>
import {writable } from "svelte/store";
import VirtualScroll from './3rdparty/virtualscroll';
import {_,tosim,palitrans} from './js/store.js';
export let excerpts=[];
export let ptk, side=0 ,lang;
export let selectedheadings={};

$: side;
let showing=true;

$: stats=statByHeading(excerpts);
const setshowmode=()=>showing=!showing;
const statByHeading=()=>{
    const byBook={};
    for (let i=0;i<excerpts.length;i++) {
        const ex=excerpts[i];
        if (!byBook[ex.chunk]) byBook[ex.chunk]=0;
        byBook[ex.chunk]++;
    }
    const out=[];
    for (let bk in byBook) out.push([bk,byBook[bk]]);
    out.sort((a,b)=>b[1]-a[1]);
    const all=Object.keys(selectedheadings).length==0;
    const cl=ptk.getChunkLabel();
    return out.map(([at,count],idx)=> {return {idx,key:at,selected:selectedheadings[at]||all, name:cl.names[at], count }} )
}
const selectAll=(_stats,onoff)=>{
    for (let i=0;i<stats.length;i++) {
        stats[i].selected=onoff;
    }
}

let selectedBookCount=0;
const updateFilter=()=>{
    selectedheadings={};
    const books=stats.filter(it=>it.selected).map(it=>it.key);
    selectedBookCount=0;
    for (let i=0;i<books.length;i++) {
        selectedheadings[books[i]]=true;
        selectedBookCount++;
    }
}
const toggleInclusive=evt=>{
    const idx=parseInt(evt.target.attributes.idx.value);
    if (selectedBookCount==1 && stats[idx].selected) {
        selectAll(stats,true);
    } else {
        selectAll(stats,false);
    }
    stats[idx].selected=!stats[idx].selected;
    updateFilter();
}
const toggleSelect=evt=>{
    const idx=parseInt(evt.target.attributes.idx.value);
    stats[idx].selected=!stats[idx].selected;
    updateFilter();
}
</script>
<span class="hamburger" class:showing on:click={setshowmode}>☰</span>
{#if showing}
<div  class="dropdownpanel stats">
<VirtualScroll keeps={30} data={stats} key="key" let:data>
<div class="statitem">
    <span on:click={toggleInclusive} idx={data.idx} class="clickable" class:selected={data.selected}>
        {_(lang,data.name,$tosim,$palitrans,12)}
    </span>
    <span on:click={toggleSelect} idx={data.idx} class="clickable fulltext-hit hit-button">
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
.hit-button {padding-left:5px;padding-right:10px;float:right;padding-top: 5px}
</style>
