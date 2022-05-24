<script>
import { DEFAULT_LANGUAGE, ALIGNED_KEY,useBasket} from 'pitaka';
import VirtualScroll from './3rdparty/virtualscroll'
import Keywords from './comps/keywords.svelte';
import {getSeqColor,getLangstyle} from './js/decorate.js'
import {_,tosim, factorization,palitrans} from './js/store.js'
import { settab } from './js/addresses';
import { parseOfftextLine,parseAddress ,stringifyAddress } from 'pitaka/offtext';
import { unique } from 'pitaka/utils'
import { getContext } from 'svelte';
import { derived } from 'svelte/store';
import Colorhr from './comps/colorhr.svelte';
export let chunks=[];

export let ptk, side=0, postings=[] , aligned='';
export let fullname=true;
export let onKeyword=null;
export let onScroll=null;
export let lang=ptk.header.lang||DEFAULT_LANGUAGE;
export let showChunkExcerpt=function(){};
let vscroll;

// const displayItems=derived(items,(I,set)=>{

const {names,linepos,idarr} =ptk.getHeadingLabel();
// $: console.log('chunklinepos',( chunks.map(ck=>ptk.chunkLinepos(ck)) ).map(line=>ptk.headingOf(line)) )
const getHeadings= (chunks)=>unique(chunks.map(ck=>ptk.headingOf( ptk.chunkLinepos(ck) )).map(heading=>{
        const {at,y,text}=heading;
        const y0=linepos[at];
        const id=idarr[at];
        return {key:y,id, chunk:at,text, y0};    
}));

$: headings = getHeadings(chunks);
$: langstyle=getLangstyle(lang,$palitrans);

const getTitle=(heading,tosim,pltrans)=>{
    if (!heading) return '';
    heading=heading.replace(/\]\^/g,'] ^');
    const [text,tags]=parseOfftextLine(heading);
    let s=fullname?text.replace(/\|.+/,''):text.replace(/.+\|/,'');
    return _(lang,s,tosim,pltrans);
}


$: if(vscroll&&headings.length) { vscroll.scrollToOffset(0) } //scrolltotop when data is updated

const scroll=(evt)=>{
    onScroll&&onScroll(evt.detail.index);
}
const goitem=(y0)=>{
    const loc=ptk.locOf(y0);
    const ptr=parseAddress(loc);
    if (alignedPitaka.length) ptr[ALIGNED_KEY]=alignedPitaka.map(p=>p.name).join(',');
    const addr=stringifyAddress(ptr);
    settab(side,addr,{newtab:true})
}

let alignedPitaka=[];
$: alignedPitaka=(aligned.split(',')||[]).map(n=>useBasket(n)).filter(it=>!!it);

</script>
<VirtualScroll bind:this={vscroll} start={-1}   on:scroll={scroll}
keeps={50} data={headings} height="calc(100% - 1.5em)" let:data key="key">
<div>
    <span class="bookid">{data.id}</span>
    <span class={"clickable "+langstyle} on:click={()=>goitem(data.y0)}>{getTitle(data.text,$tosim,$palitrans,$factorization)}</span>
    
    {#if postings.length}
    <span on:click={()=>showChunkExcerpt(data.chunk)} class="fulltext-hit clickable hit-link">{ptk.postingInChunk(postings,data.chunk).length}</span>
    {/if}

    {#if data.keywords}
    {#each data.keywords as [label,keyid]}
    <t {label} class={"clickable "+ label}>
        <Keywords {onKeyword} {ptk} {label} {keyid}/>
    </t>
    {/each}
    {/if}
    
    <!-- 其他語言的標題 ，在 headingMenu 選擇 //-->
    {#each alignedPitaka as p,idx}
    <div on:click={()=>goitem(data.y0)} style={"color:"+getSeqColor(idx+1)} class={"tocitem "+getLangstyle(p.header.lang,$palitrans)}>{p.headingOf(ptk.locOf(data.y0,true)).rawtext}
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
<style>
    .hit-link {font-size: 1em;padding-left: 5px;padding-right: 5px}
</style>