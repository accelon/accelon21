<script>
import { getContext } from 'svelte';
import {tosim,labelerOf} from './js/store.js';
import {decoratePage} from './js/decorate.js';
import {composeSnippet,OfftextToSnippet, parseHook,OffTag, parseOfftextLine} from 'pitaka/offtext'
import {bestEntries,PATHSEP} from 'pitaka';
import {getTextHook} from './js/selection.js';
import {cursorAddress} from './js/address.js';
import {saveNote} from './js/usernotes';
import {saveBookmarks} from './js/bookmarks';
import {getActivelineStore,setActiveline} from './js/addresses.js';
export let key=0 //缺少 y 的話，以 key 作 y
export let y0=0   //本章第一行
export let y=0   //優先權較高
export let nesting=0;
export let keywords=[];
export let active=false;
export let linetofind='';
export let text=''
export let id=''

export let side=0;
export let loc='' ; //location of the page
export let childcount=0;
export let backlinks=[];
export let usernotes=null; // this is a store created by addresses.js
export let bookmarks=null; // this is a store created by addresses.js
export let q=''; //the quote text
export let hook='';
export let ptk=null;  //if ptk is missing, text might come from various pitaka, and need to be prefetch.

const addresses=getContext('addresses');
let extra=[], activeline=getActivelineStore(addresses);

const lineText=()=>text||(ptk&&ptk.getLine(y||key))||'';
$: onlytext=parseOfftextLine(lineText())[0];
const sortExtra=()=>{
    extra.sort((a,b)=>a.x==b.x?b.w-a.w:a.x-b.x);
    extra=extra;
}
const refreshnote=()=>{
    extra=extra.filter(it=>it.name!=='unote');
    $usernotes[delta].forEach(addNote);
    sortExtra();
}
$: extra=decoratePage(ptk,onlytext, {backlinks,hook,y,q,linetofind});
$: ptk && usernotes && $usernotes[delta]  && refreshnote($usernotes[delta]);


const addNote=note=>{
    const {marker,text,hook,br}=note;
    if (!hook) return;
    const {x,w}=parseHook(hook,lineText() )
    extra.push(new OffTag('unote',{
       hook,text,marker,br,x,y,ptk:ptk.name,loc,y:y||key}, 0,x,w))
}
const delta=(y||key)-y0;


const update=({detail})=>{
    if (detail.hook) {
        const linenotes=$usernotes[delta];
        const i=linenotes.findIndex(it=>it.hook===detail.hook);
        const j=extra.findIndex(it=>it.name=='unote'&&it.attrs.hook===detail.hook);
        if (i>-1) {
            saveNote({...extra[j].attrs, ...detail },detail.marker==-1?'remove':'');
            if (detail.marker===-1) linenotes.splice(i,1);
            else linenotes[i]=detail
        }
        $usernotes[delta]=linenotes;
        refreshnote();
    }
}


const onSelection=evt=>{//user note and highlight etc
    const {hook,sel,x,y}=getTextHook(ptk,evt);
    cursorAddress.set({ptk,sel,loc,x,y,hook,usernotes,bookmarks,delta});
}

const click=evt=>{
    if (evt.button!==0) return;
    setActiveline(addresses,y||key ,y0);
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
            sortExtra();
        }
    }
}
const closelabel=()=>{
    extra=extra.filter(i=>i.name!=='embed');
}
const toggleBookmark=evt=>{
    let bm=$bookmarks[delta];
    if (!bm) {
        bm=1;
    } else {
        bm++;
    }
    if (bm>2) bm=0;
    $bookmarks[delta]=bm;
    saveBookmarks(ptk,loc,$bookmarks);
}
</script>
<div class="linetext" class:activeline={$activeline===key} on:click={click}>
<!-- {#if ptk && $vstate.y==key}<LineMenu {loc} {col} y={y||key} {ptk}/>{/if} -->
{#each OfftextToSnippet(lineText(), extra) as snpt}
{#if labelerOf(snpt.open.name)}<!-- 
open.name 存在則是此標籤的起點 為避免多餘的空格，前後labeler 和 snippet 要連成一行。
//--><svelte:component this={labelerOf(snpt.open.name)} opening={1} {nesting}
    on:update={update} on:close={closelabel} {ptk} text={snpt.text} starty={y||key} {...snpt.open} />{/if}<!-- 
所有加諸在此段文字的樣式，一個標籤可能會被拆成多段 
//--><span >{@html composeSnippet(snpt,y||key,$tosim)}</span>{#if labelerOf(snpt.close.name)}<!-- 
close.name 存在，則是該標籤的終點。屬性在 sntp.open
//--><svelte:component this={labelerOf(snpt.close.name)} opening={0} {nesting}
   on:update={update} on:close={closelabel} {ptk} text={snpt.text} starty={y||key} {...snpt.open} />
{/if}{/each}
<span on:click={toggleBookmark} class={'bookmark bookmark'+($bookmarks&&$bookmarks[delta])}></span>
</div>

