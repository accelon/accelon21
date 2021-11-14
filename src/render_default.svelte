<script>
import {tosim,labelerOf, renderer} from './js/store.js';
import {composeSnippet,OfftextToSnippet, parseHook,OffTag} from 'pitaka/offtext'
import {bestEntries,PATHSEP} from 'pitaka';
import {diffCJK,trimPunc} from 'pitaka/utils';
import {getTextHook} from './js/selection.js';
import {cursorAddress} from './js/address.js';
import { createEventDispatcher } from 'svelte';
import {updateNote} from './js/usernotes';
const dispatch = createEventDispatcher();
    // import LineMenu from './linemenu.svelte';

export let key=0 //缺少 y 的話，以 key 作 y
export let y=0   //優先權較高
export let nesting=0;
export let keywords=[];
export let text=''
export let id=''
export let loc='' ; //location of the page
export let ptr=''   //  (for toc page)
export let childcount=0;
export let backlinks=[];
export let usernotes=[];
export let q=''; //the quote text
export let hook='';
export let ptk=null;  //if ptk is missing, text might come from various pitaka, and need to be prefetch.
let extra=[];
const lineText=()=>text||(ptk&&ptk.getLine(y||key));

if (ptk &&backlinks && backlinks.length) { //convert backlink hook to tag
    const linksAt={};
    backlinks.forEach(bl=>{
        const [hstr,srcptr]=bl;
        const linetext=text||(ptk&&ptk.getLine(y||key));
        if (!linetext)return;
        const H=parseHook(hstr, linetext);
        const lkey=H.y+'_'+(H.x+H.w);
        if (!linksAt[lkey]) linksAt[lkey]=[];
        linksAt[lkey].push( [srcptr, H.y, H.x,H.w] );
    })
    for (let i in linksAt) {
        const links=linksAt[i];
        const [srcptr, y,x,w]=links[0];
        const srcptrs=links.map(i=>i[0]).join(';');
        extra.push( new OffTag('blnk',{'@':srcptrs,x,w}, y,x+w,0))
    }
}
const addNote=note=>{
    const {x,w}=parseHook(note.hook,lineText() )
        extra.push(new OffTag('unote',{note,marker:note.marker,x,y,ptk:ptk.name,loc,y:y||key}, 0,x,w))
}
if (ptk && usernotes && $usernotes.length) {
    $usernotes.forEach(addNote);
}

const update=({detail})=>{
    if (detail.note) {
        const i=extra.findIndex(it=>(it.name==='unote' && it.attrs.note===detail.note));
        if (i>-1) {
            updateNote(extra[i].attrs,detail.op);
            extra.splice(i,1);
            if (!detail.remove) {
                addNote(detail.note);
            }
            extra=extra;
        }
    }
}


if (hook) {
    extra.push( new OffTag('cite',{},hook.y-y,hook.x,hook.w) );
    const linetext=text||(ptk&&ptk.getLine(y||key));
    const D=diffCJK(trimPunc(q),linetext,hook.x,hook.w)
    let x=hook.x;
    D[0].forEach(d=>{
        if (d.added) {
            extra.push( new OffTag('ins',{}, 0,x, d.value.length)) ;
            x+=d.count;
        } else if (d.removed) {
            extra.push( new OffTag('del',{'t': d.value}, 0, x,1)) ;
            
        } else x+=d.count;
    })
    extra=extra;
}
extra.sort((a,b)=>a.x==b.x?b.w-a.w:a.x-b.x);

const onSelection=evt=>{//user note and highlight etc
    const {hook,sel,x,y}=getTextHook(ptk,evt);
    cursorAddress.set({ptk,sel,loc,x,y,hook});
}

const click=evt=>{
    if (evt.button!==0) return;
    if (evt.target.tagName=='T') {
        if (evt.target.classList.contains('e')) return;
        onSelection(evt);
        if (getSelection().toString().length) return; 

        let {x,y,ori}=getTextHook(ptk,evt);
        if (evt.target.classList.contains('se')) {
            ori=evt.target.innerText;
            x=parseInt(evt.target.attributes.x.value);
        }
        const entries = bestEntries(ori)||[];
        if (!entries.length) return;
        const E=entries[0];
        const ptr=entries.map(entry=>PATHSEP+entry.ptk+PATHSEP+entry.e).join(';');
        const w=E.e.length;
        //single click to close the embed
        const opened=extra.filter(i=>i.name=='embed'&&(x>=i.x&&(i.x+i.w>x)));
        extra=extra.filter(i=>i.name!=='embed').filter(i=>!!i);
        if (opened.length===0) {
            extra.push( new OffTag('embed',{'@':ptr,x,w,y},0,x,w) );
            // console.log()
            extra.sort((a,b)=>a.x==b.x?b.w-a.w:a.x-b.x);
            extra=extra;
        }
    }
}
const closelabel=()=>{
    extra=extra.filter(i=>i.name!=='embed');
}
const setkeyword=({detail})=>{
    dispatch('setkeyword',detail);
}

</script>
<div class="linetext">
{#if ptk && ptr} <!-- 目錄行 -->
<svelte:component this={$renderer._toc} on:setkeyword={setkeyword} {ptk} {text} {keywords} {childcount} {id} loc={ptr}/>
{:else}
<!-- {#if ptk && $vstate.y==key}<LineMenu {loc} {col} y={y||key} {ptk}/>{/if} -->
{#each OfftextToSnippet(lineText(), extra) as snpt}
{#if labelerOf(snpt.open.name)}<!-- 
open.name 存在則是此標籤的起點 為避免多餘的空格，前後labeler 和 snippet 要連成一行。
//--><svelte:component this={labelerOf(snpt.open.name)} opening={1} {nesting}
    on:update={update} on:close={closelabel} {ptk} text={snpt.text} starty={y||key} {...snpt.open} />{/if}<!-- 
所有加諸在此段文字的樣式，一個標籤可能會被拆成多段 
//--><span on:click={click}>{@html composeSnippet(snpt,y||key,$tosim)}</span>{#if labelerOf(snpt.close.name)}<!-- 
close.name 存在，則是該標籤的終點。屬性在 sntp.open
//--><svelte:component this={labelerOf(snpt.close.name)} opening={0} {nesting}
   on:update={update} on:close={closelabel} {ptk} text={snpt.text} starty={y||key} {...snpt.open} />
{/if}{/each}{/if}
</div>

<style>
    .linetext {padding-top:0.5em;line-height:1.8}
</style>