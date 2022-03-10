<script>
import { DEFAULT_LANGUAGE, useBasket} from 'pitaka';
import VirtualScroll from './3rdparty/virtualscroll'
import Keywords from './comps/keywords.svelte';
import {_,tosim, palitrans} from './js/store.js'
import { settab } from './js/addresses';
import { parseOfftextLine,parseAddress ,stringifyAddress } from 'pitaka/offtext';
import { getContext } from 'svelte';
import Colorhr from './comps/colorhr.svelte';
export let items;
export let ptk;
export let side=0;
export let fullname=true;
export let onKeyword;
export let onScroll;
export let lang=ptk.header.lang||DEFAULT_LANGUAGE;
let vscroll;

const stor=getContext('bkstore');
$: langstyle=getLangstyle(lang,$palitrans);

const getLangstyle=(l,trans)=>'lang-'+l+(l==='pl'?'-'+(trans||''):'');

const getTitle=(heading,tosim,pltrans)=>{
    heading=heading.replace(/\]\^/g,'] ^');
    const [text,tags]=parseOfftextLine(heading);
    return _(fullname?text.replace(/\|.+/,''):text.replace(/.+\|/,''),tosim,pltrans);
}

const getColor=cnt=>'hsl('+((cnt+2)*60) +' ,50%,50%)'

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
$: alignedPitaka=$stor.aligned.map(n=>useBasket(n));

</script>
<VirtualScroll bind:this={vscroll} start={-1}   on:scroll={scroll}
keeps={50} data={$items} key="key" height="calc(100% - 1.5em)" let:data >
<div>
    <span class="bookid">{data.id}</span>
    <span class={"tocitem "+langstyle} on:click={()=>goitem(data.y0)}>{getTitle(data.text,$tosim,lang==='pl'&&$palitrans)}</span>
    {#each data.keywords as [label,keyid]}
    <t {label} class={"clickable "+ label}>
        <Keywords {onKeyword} {ptk} {label} {keyid}/>
    </t>
    {/each}

    <!-- 其他語言的標題 ，在 headingMenu 選擇 //-->
    {#each alignedPitaka as p,idx}
    <div on:click={()=>goitem(data.y0)} style={"color:"+getColor(idx)} class={"tocitem "+getLangstyle(p.header.lang,$palitrans)}>
    {getTitle(p.headingOf( ptk.locOf(data.y0,true)).text,$tosim,p.header.lang==='pl'&&$palitrans )}</div>
    {/each}

    <!-- 如有其他語言，畫線分隔 //-->
    {#key alignedPitaka}
    {#if alignedPitaka&&alignedPitaka.length}
    <Colorhr nesting={alignedPitaka.length}/>
    {/if}
    {/key}
</div>
</VirtualScroll>