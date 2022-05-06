<script>
import { DEFAULT_LANGUAGE, useBasket} from 'pitaka';
import VirtualScroll from './3rdparty/virtualscroll'
import Keywords from './comps/keywords.svelte';
import {getSeqColor,getLangstyle} from './js/decorate.js'
import {_,tosim, factorization,palitrans} from './js/store.js'
import { settab } from './js/addresses';
import { parseOfftextLine,parseAddress ,stringifyAddress } from 'pitaka/offtext';
import { getContext } from 'svelte';
import { derived } from 'svelte/store';
import Colorhr from './comps/colorhr.svelte';
export let items;

export let ptk;
export let side=0;
export let fullname=true;
export let onKeyword;
export let onScroll;
export let lang=ptk.header.lang||DEFAULT_LANGUAGE;
let vscroll;
const displayItems=derived(items,(I,set)=>{
    const {names,linepos,idarr} =ptk.getHeadingLabel();
    set(I.map((it,idx)=>{
        const y0=linepos[it];
        return {key:it,id:idarr[it], text:names[it], y0};
    }));
},[]);
const stor=getContext('bkstore');

$: langstyle=getLangstyle(lang,$palitrans);

const getTitle=(heading,tosim,pltrans)=>{
    if (!heading) return '';
    heading=heading.replace(/\]\^/g,'] ^');
    const [text,tags]=parseOfftextLine(heading);
    let s=fullname?text.replace(/\|.+/,''):text.replace(/.+\|/,'');
    return _(s,tosim,pltrans);
}


$: if(vscroll&&$items.length) { vscroll.scrollToOffset(0) } //scrolltotop when data is updated

const scroll=(evt)=>{
    onScroll&&onScroll(evt.detail.index);
}
const goitem=(y0)=>{
    const loc=ptk.locOf(y0);
    const ptr=parseAddress(loc);
    if (alignedPitaka.length) ptr.al=alignedPitaka.map(p=>p.name).join(',');
    const addr=stringifyAddress(ptr);
    settab(side,addr,{newtab:true})
}
$: alignedPitaka=($stor.aligned||[]).map(n=>useBasket(n));

</script>
<VirtualScroll bind:this={vscroll} start={-1}   on:scroll={scroll}
keeps={50} data={$displayItems} key="key" height="calc(100% - 1.5em)" let:data >
<div>
    <span class="bookid">{data.id}</span>
    <span class={"tocitem "+langstyle} on:click={()=>goitem(data.y0)}>{getTitle(data.text,$tosim,lang==='pl'&&$palitrans,$factorization)}</span>
    {#if data.keywords}
    {#each data.keywords as [label,keyid]}
    <t {label} class={"clickable "+ label}>
        <Keywords {onKeyword} {ptk} {label} {keyid}/>
    </t>
    {/each}
    {/if}
    
    <!-- 其他語言的標題 ，在 headingMenu 選擇 //-->
    {#each alignedPitaka as p,idx}
    <div on:click={()=>goitem(data.y0)} style={"color:"+getSeqColor(idx+1)} class={"tocitem "+getLangstyle(p.header.lang,$palitrans)}>
    {getTitle(p.headingOf( ptk.locOf(data.y0,true)).text,$tosim,p.header.lang==='pl'&&$palitrans ,$factorization)}</div>
    {/each}

    <!-- 如有其他語言，畫線分隔 //-->
    {#key alignedPitaka}
    {#if alignedPitaka&&alignedPitaka.length}
    <Colorhr nesting={alignedPitaka.length}/>
    {/if}
    {/key}
</div>
</VirtualScroll>