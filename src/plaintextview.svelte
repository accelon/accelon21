<script>
import Btn from './comps/button.svelte';
import StateBtn from './comps/statebutton.svelte';
import { OfftextToHtml } from 'pitaka/offtext';
import Icons from './comps/icons.js';
import {getItem,setItem} from './js/storage.js';
import {srcfilename,srcexcerpts, texttoc,tofind,txtashtml,tosim} from './js/store_toolbox.js'
import VirtualScroll from 'svelte-virtual-scroll-list'
import {getCursorWord} from './js/selection.js'
import { tick } from 'svelte';

$: items = $srcexcerpts;
let vs , rulerline=0 , scrollindex=0;
let optionmenu=false;
$: getItem($srcfilename+"@rulerline",r=>parseInt(r)?(rulerline=parseInt(r)):torulerline(0,true))

const totop=()=>{
    vs.scrollToIndex(0);
    vs.scrollToOffset(0);//workaround filter keyword is set 
    lastUkey=0;
}
$: vs&&vs.scrollToIndex(scrollindex);
const setrulerline=n=>{
    rulerline=n;
    lastUkey=n;
    setItem($srcfilename+"@rulerline",n);
}
const torulerline=(newruler,nosave=false)=>{
    const n=parseInt(newruler);
    if (!isNaN(n) && n !==rulerline && !nosave) setrulerline(n);
    scrollindex=0;
    scrollindex=rulerline;
};
let lastUkey=0;

const findoccur=(tf,from,to)=>{
    if (!cursorword) return;//no action in filter mode
    const lines=$srcexcerpts;
    if (!to) to=lines.length;
    const keywords=tf.split(/ +/).filter(i=>!!i.trim());
    if (to==-1) {//backward
        for (let i=from-1;i>0;i--) {
            if ( keywords.reduce( (r,key)=>r&&lines[i].text.includes(key) ,true )) {
                scrollindex=i;
                lastUkey=i;
                return true;
            }
        }
    }

    for (let i=from;i<to;i++) {
        if ( keywords.reduce( (r,key)=>r&&lines[i].text.includes(key) ,true )) {
            scrollindex=i;
            lastUkey=i;
            return true;
        }
    }
}
const nextoccur=async ()=>{
    if (findoccur(cursorword,lastUkey+1)) return;

    if (lastUkey) { //try again from the beginning
        scrollindex=0;
        await tick();
        findoccur(cursorword,0,lastUkey);
    }
}
const prevoccur=async ()=>{
    findoccur(cursorword,lastUkey,-1);
}

const paranum=({ukey,text})=>{
    if (ukey%5==0 || $tofind ) return ukey;
    return text?'':'　'; 
}
let cursorword='';
const gotoc=ukey=>{
    const nline=$texttoc[ukey];
    if (nline) {
        torulerline(nline);
    } else {
        const tf=getCursorWord().tofind.substr(0,2);
        if(tf) cursorword=tf.replace(/[^\u3400-\u9fff]+.*$/g,'').substr(0,5);
        else setrulerline(ukey)
    }
}
const renderLine=({text,ukey},cw,renderinlinetag,sim)=>{
    lastUkey=ukey;
    let s=OfftextToHtml(text,[cw,(cw==$tofind?'':$tofind)],renderinlinetag,sim);
    return s;
}
const inputkeyup=async evt=>{
    if (evt.key=='Enter') {
        $tofind=cursorword;
        cursorword='';
        await tick();
        totop();
    } else if (evt.key==='ArrowDown') {
        await nextoccur();
    } else if (evt.key==='ArrowUp') {
        await prevoccur();
    }
}
const cleartofind=async ()=>{
    $tofind='';
    scrollindex=0;
    await tick();
    scrollindex=rulerline;
}
const toggleoptionmenu=()=>{
    optionmenu=!optionmenu;
}
$: leftcaption= $tofind?($tofind+'('+$srcexcerpts.length+')'):'';
</script>
<svelte:options accessors/>
<div class="logger">
    <div class="controls">
    <Btn icon='ruler' disabled={!rulerline} title={rulerline} onclick={torulerline} />
    <Btn icon="totop" onclick={totop}/>

    <input bind:value={cursorword} title='↑Prev  ↓Next  ⮠ Search' on:keyup={inputkeyup} />
    <Btn disabled={!cursorword} onclick={nextoccur} icon='rightanglearrow'/>
    <Btn disabled={!$tofind}  onclick={cleartofind} {leftcaption} icon="deletecancel"/>

    <Btn icon="setting" onclick={toggleoptionmenu}/>
    {#if optionmenu}
    <input type=number style="width:4em" bind:value={scrollindex} />
    <Btn icon="html5" store={txtashtml}/>
    <StateBtn states={{0:"原本",1:"简體",2:"简体"}} store={tosim}/>
    {/if}

    </div>
    <VirtualScroll bind:this={vs} keeps={50} data={items} key="ukey" let:data>
        {#if rulerline && rulerline===data.ukey }
        <div class="ruler"><span>{@html Icons.ruler}</span></div>
        {/if}
        <div class="linetext"
             class:clickable={$texttoc[data.ukey] } 
             on:click={()=>gotoc(data.ukey)} style="height:{data.height}px">
            <span class="itemindex">{paranum(data)}</span>
            <span index={data.ukey} data-ori={data.text}>{@html renderLine(data,cursorword,$txtashtml,$tosim)}</span>
        </div>

    </VirtualScroll>

</div>
<style>

:global(.hl0) {color:var(--highlight0)}
:global(.hl1) {color:var(--highlight1)}
:global(.linetext) {padding-bottom:5px;padding-top:5px;line-height:1.8;}

.controls{ -webkit-user-select: none;background : var(--panel-background)}
.clickable {cursor:pointer; }
.clickable:hover { text-decoration: underline;}
.ruler {height:1em;border-top:3px dotted var(--highlight)}
.logger {height:calc(100vh - 2em);  }
.itemindex {font-size:50%;color:gray;}
</style>
