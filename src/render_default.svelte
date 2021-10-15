<script>
import {tosim,labelerOf, renderer} from './js/store.js';
import {composeSnippet,OfftextToSnippet, parseHook,OffTag} from 'pitaka/offtext'
import {bestEntries,PATHSEP} from 'pitaka';
import {getTextHook} from './js/selection.js';
    // import LineMenu from './linemenu.svelte';

export let key=0 //缺少 y 的話，以 key 作 y
export let y=0   //優先權較高
export let nesting=0;
export let text=''
export let loc=''
export let backlinks='';
export let q=''; //the quote text
export let hook='';
export let ptk=null;  //if ptk is missing, text might come from various pitaka, and need to be prefetch.
let extra=[];

if (ptk &&backlinks && backlinks.length) { //convert backlink hook to tag
    const linksAt={};
    backlinks.forEach(bl=>{
        const [hstr,srcptr]=bl;
        const linetext=text||(ptk&&ptk.getLine(y||key));
        const hook=parseHook(hstr, linetext);
        const lkey=hook.y+'_'+(hook.x+hook.w);
        if (!linksAt[lkey]) linksAt[lkey]=[];
        linksAt[lkey].push( [srcptr, hook.y, hook.x,hook.w] );
    })
    for (let i in linksAt) {
        const links=linksAt[i];
        const [srcptr, y,x,w]=links[0];
        const srcptrs=links.map(i=>i[0]).join(';');
        extra.push( new OffTag('blnk',{'@':srcptrs,x,w}, y,x+w,0))
    }
}
if (hook) {
    extra.push( new OffTag('cite',{},hook.y-y,hook.x,hook.w) );
    extra=extra;
}
// $: extra=extra.filter(i=> i.y===y || i.name!=='embed');

extra.sort((a,b)=>a.x==b.x?b.w-a.w:a.x-b.x);
export let col=0;
const mouseup=async evt=>{
    if (evt.button!==0) return;
    if (evt.target.tagName=='T') {
        if (evt.target.classList.contains('e')) return;
        const {hook,x,y,sel,t,ori}=getTextHook(ptk,evt);
        if (sel) { //selection menu

        } else {
            const entries = bestEntries(ori)||[];
            if (!entries.length) return;
            const E=entries[0];
            const ptr=PATHSEP+E.ptk+PATHSEP+E.e;
            const w=E.e.length;
            const lblx=x+w;
            extra=extra.filter(i=>i.name!=='embed');
            extra.push( new OffTag('embed',{'@':ptr,x,w,y},0,lblx,0) );
            extra.sort((a,b)=>a.x==b.x?b.w-a.w:a.x-b.x);
            extra=extra;
        }
    }
}
const closelabel=()=>{
    extra=extra.filter(i=>i.name!=='embed');
}
</script>
<div class="linetext">
{#if ptk && loc} <!-- 目錄行 -->
<svelte:component this={$renderer._toc} {ptk} {text} {loc} {col}/>
{:else}
<!-- {#if ptk && $vstate.y==key}<LineMenu {loc} {col} y={y||key} {ptk}/>{/if} -->
{#each OfftextToSnippet(text||ptk&&ptk.getLine&&ptk.getLine(y||key), extra) as snpt}
{#if labelerOf(snpt.open.name)}
<!-- open.name 存在則是此標籤的起點 -->
<svelte:component this={labelerOf(snpt.open.name)} opening={1} {nesting}
on:close={closelabel} {ptk} starty={y||key} {...snpt.open} />
{/if}
<!-- 所有加諸在此段文字的樣式，一個標籤可能會被拆成多段 -->
<span on:mouseup={mouseup}>{@html composeSnippet(snpt,y||key,$tosim)}</span>
{#if labelerOf(snpt.close.name)}
<!-- close.name 存在，則是該標籤的終點。屬性在 sntp.open-->
<svelte:component this={labelerOf(snpt.close.name)} opening={0} {nesting}
on:close={closelabel} {ptk} starty={y||key} {...snpt.open} />
{/if}
{/each}
{/if}
</div>

<style>
    .linetext {padding-top:0.5em;line-height:1.8}
</style>