<script>
import {tosim,edict,palitrans,labelerOf,picked,factorization} from './js/store.js';
import {decoratePage,getSeqColor} from './js/decorate.js';
import {composeSnippet,OfftextToSnippet, OffTag, parseOfftextLine} from 'pitaka/offtext'
import {parseHook} from 'pitaka/align';
import {factorizeText} from 'pitaka/pali'
import {bestEntries,DEFAULT_LANGUAGE,PATHSEP} from 'pitaka';
import {offtext2indic} from 'provident-pali'
import {getTextHook,getCursorWord,markSelection} from './js/selection.js';
import {cursorAddress} from './js/address.js';
import {saveNote} from './js/usernotes';
import Bookmark from './bookmark.svelte'

import {setActiveLine,setActiveOffset} from './js/addresses.js';
export let q=''; //the quote text
export let hook='';
export let setactiveline=true;
export let master=false;
export let ptk=null;  //if ptk is missing, text might come from various pitaka, and need to be prefetch.
export let key=0 //缺少 y 的話，以 key 作 y
export let y0=0   //本章第一行
export let y=0   //優先權較高
export let lang=ptk.header.lang||DEFAULT_LANGUAGE;
export let notes=null;
$: langstyle='lang-'+lang+(lang==='pl'?'-'+($palitrans||''):'')
export let activeline=false;
export let nesting=0,text='',loc='',side=0,id='',hits=[];
export let activelinecolor=0;
export let backlinks=[];
export let usernotes=null; // this is a store created by addresses.js
export let bookmarks=null; // this is a store created by addresses.js
$: id,hits;

$: extra=decoratePage(ptk,onlytext, {backlinks,hook,y,q,notes,hits});

$: lineText=()=>{
    let s=text||(ptk&&ptk.getLine(y||key))||''
    if (lang==='pl') {
        const f=$factorization;
        //factorization , 0:never, 1:activeline   2 :always
        s=factorizeText(s, (activeline && f==1) || f>1 , $palitrans);
    }
    return s;
};

const transcript=(str,palitrans)=>{
    if (lang!=='pl') return str;
    return offtext2indic(str,palitrans);
}

$: onlytext= parseOfftextLine(lineText())[0];

const sortExtra=()=>{
    extra.sort((a,b)=>a.x==b.x?b.w-a.w:a.x-b.x);
    extra=extra;
}
const refreshnote=()=>{
    extra=extra.filter(it=>it.name!=='unote');
    $usernotes[dy].forEach(addNote);
    sortExtra();
}
$: ptk && usernotes && $usernotes[dy]  && refreshnote($usernotes[dy]);

const addNote=note=>{
    const {marker,text,hook,br}=note;
    if (!hook) return;
    const {x,w}=parseHook(hook,onlytext);
    extra.push(new OffTag('unote',{
       hook,text,marker,br,x,y,ptk:ptk.name,loc,y:y||key}, 0,x,w))
}

const dy=(y||key)-ptk.locY(loc);

const update=({detail})=>{
    if (detail.hook) {
        const linenotes=$usernotes[dy];
        const i=linenotes.findIndex(it=>it.hook===detail.hook);
        const j=extra.findIndex(it=>it.name=='unote'&&it.attrs.hook===detail.hook);
        if (i>-1) {
            saveNote({...extra[j].attrs, ...detail },detail.marker==-1?'remove':'');
            if (detail.marker===-1) linenotes.splice(i,1);
            else linenotes[i]=detail
        }
        $usernotes[dy]=linenotes;
        refreshnote();
    }
}

const onSelection=evt=>{//user note and highlight etc
    const {hook,sel,x,y}=getTextHook(ptk,evt,lang,$palitrans);
    cursorAddress.set({ptk,sel,loc,x,y,hook,usernotes,bookmarks,dy});
}

const click=evt=>{
    if (evt.button!==0) return;
    setactiveline && !nesting && setActiveLine(ptk,side,y||key ,y0);

    //scroll offset of the activeline
    const toolbarheight=evt.pageY-evt.layerY + 5; // don't know why ?? cannot can precise offset
    const activeoffset=evt.target.getBoundingClientRect().y-toolbarheight;
    !nesting && setActiveOffset(side,activeoffset);
    if (evt.target.tagName=='T') {
        if (evt.target.classList.contains('e')) return;
        onSelection(evt);
        if (getSelection().toString().length) return; 

        let {x,y,elex,ori, t ,  word, lexeme, orix}=getTextHook(ptk,evt,lang,$palitrans);
        if (evt.target.classList.contains('se')) {
            ori=evt.target.innerText;
            x=parseInt(evt.target.attributes.x.value);
        }

        picked.set({word,lexeme});
    
        extra=extra.filter(i=>!!i);
        const opened=extra.filter(i=>i.name=='embed'&&(x>=i.x&&(i.x+i.w>x)));

        extra=extra.filter(i=>i.name!=='embed');

        if (evt.target.classList.contains('embed')) { //close if click on embeded span
            sortExtra();
            return;
        }

        if ($edict==1) {
            if (word && lang=='pl') {
                const w=oriword.length+1;
                extra.push( new OffTag('embed',{word:oriword,x:orix,w,y},0,orix,w));
                sortExtra();
            } else {
                const entries = bestEntries(ori)||[];
                if (entries.length) {
                    const E=entries[0];
                    const ptr=entries.map(entry=>PATHSEP+entry.ptk+PATHSEP+entry.e).join(';');
                    const w=E.e.length;                    
                    //single click to close the embed

                    if (opened.length===0) {
                        extra.push( new OffTag('embed',{'@':ptr,x,w,y},0,x,w) );
                        sortExtra();
                    }            

                }
            }
        } else {
            const elestart=evt.target.attributes.x?parseInt(evt.target.attributes.x.value):0;
            markSelection(evt.target,elestart+elex,lexeme.length);
        }
    }
}
const closelabel=()=>{
    extra=extra.filter(i=>i.name!=='embed');
}

</script>
<div class={'linetext '+langstyle} class:activeline style={"border-color:"+getSeqColor(activelinecolor)} on:click={click}>
    <slot name="start"></slot>
{#each OfftextToSnippet(lineText(), extra) as snpt}
{#if labelerOf(snpt.open.name)}<!-- 
open.name 存在則是此標籤的起點 為避免多餘的空格，前後labeler 和 snippet 要連成一行。
//--><svelte:component this={labelerOf(snpt.open.name)} opening={1} {nesting} {side}
    on:update={update} on:close={closelabel} {ptk} text={transcript(snpt.text,$palitrans)} starty={y||key} {...snpt.open} />{/if}<!-- 
所有加諸在此段文字的樣式，一個標籤可能會被拆成多段 
//--><span >{@html composeSnippet(snpt,y||key,$tosim,lang==='pl',$palitrans)}</span>{#if labelerOf(snpt.close&&snpt.close.name)}<!-- 
close.name 存在，則是該標籤的終點。屬性在 sntp.open
//--><svelte:component this={labelerOf(snpt.close.name)} opening={0} {nesting}  {side}
   on:update={update} on:close={closelabel} {ptk} text={transcript(snpt.text,$palitrans)} starty={y||key} {...snpt.open} />
{/if}{/each}
{#if master}
{#if ptk.header.bookmarkable}<Bookmark {bookmarks} {dy} {ptk} {loc}/>{/if}
{/if}
<slot></slot>
</div>