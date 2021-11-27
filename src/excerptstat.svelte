<script>
import {writable } from "svelte/store";
export let excerpts=[];
export let ptk;
export let side=0;
export let filterbooks={};
let showing=true;
let stats=writable([]);

const setshowmode=()=>showing=!showing;
const statByBook=()=>{
    const byBook={};
    for (let i=0;i<excerpts.length;i++) {
        const ex=excerpts[i];
        if (!byBook[ex.nbk]) byBook[ex.nbk]=0;
        byBook[ex.nbk]++;
    }
    const out=[];
    for (let bk in byBook) out.push([bk,byBook[bk]]);
    out.sort((a,b)=>b[1]-a[1]);
    
    const bk=ptk.getLabel('bk');
    return out.map( it=> {return {selected:true,nbk:it[0], name:bk.names[it[0]], count:it[1] }} )
}
const selectAll=(_stats,onoff)=>{
    for (let i=0;i<_stats.length;i++) {
        _stats[i].selected=onoff;
    }
}

const getIdx=evt=>{
    const idx=evt.target.parentElement.attributes.idx.value;
    return parseInt(idx);
}
let selectedBookCount=0;
const updateFilter=()=>{
    filterbooks={};
    const books=$stats.filter(it=>it.selected).map(it=>it.nbk);
    selectedBookCount=0;
    for (let i=0;i<books.length;i++) {
        filterbooks[books[i]]=true;
        selectedBookCount++;
    }
}
const toggleInclusive=evt=>{
    const _stats=$stats;

    const idx=getIdx(evt);
    if (selectedBookCount==1) {
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
    const idx=getIdx(evt);
    _stats[idx].selected=!_stats[idx].selected;
    stats.set(_stats);
    updateFilter();
}
$: stats.set(statByBook(excerpts));
</script>
<span class="hamburger" class:showing on:click={setshowmode}>☰</span>
{#if showing }
<div  class="dropdownpanel">
{#each $stats as stat,idx}
<div class="statitem" {idx}>
<span on:click={toggleSelect} class="clickable" class:selected={stat.selected}>{stat.name}</span>
<span on:click={toggleInclusive} class="clickable count">{stat.count}</span></div>
{/each}
</div>
{/if}
<style>
.statitem{padding-left:5px}
.selected {color:var(--highlight)}
.count {padding-left:5px;padding-right:5px}
</style>
