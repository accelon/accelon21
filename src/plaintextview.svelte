<script>
import Btn from './button.svelte';
import Icons from './icons';
import {getItem,setItem} from './storage.js';
import {srcfilename,srcexcerpts, texttoc,tofind} from './store.js'
import VirtualScroll from 'svelte-virtual-scroll-list'
import {getCursorWord} from 'kaigua'
import { tick } from 'svelte';
$: items = $srcexcerpts;
let vs , rulerline=0 , scrollindex=0;

$: getItem($srcfilename+"@rulerline",r=>parseInt(r)?(rulerline=parseInt(r)):torulerline(0,true))

const totop=()=>{vs.scrollToIndex(0);lastUkey=0;}
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

const findoccur=(tofind,from,to)=>{
    const lines=$srcexcerpts;
    if (!to) to=lines.length;

    if (to==-1) {//backward
        for (let i=from-1;i>0;i--) {
            if (lines[i].text.indexOf(tofind)>-1) {
                scrollindex=i;
                lastUkey=i;
                return true;
            }
        }
    }

    for (let i=from;i<to;i++) {
        if (lines[i].text.indexOf(tofind)) {
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
        findoccur(regex,0,lastUkey);
    }
}
const prevoccur=async ()=>{
    findoccur(cursorword,lastUkey,-1);
}

const paranum=({ukey,text})=>{
    if (ukey%5==0 || $tofind ) return ukey;
    return text?'':'　'; 
}
let cursorword;
const gotoc=ukey=>{
    const nline=$texttoc[ukey];
    if (nline) {
        torulerline(nline);
    } else {
        const tf=getCursorWord().tofind;
        if(tf) cursorword=tf.replace(/[^\u3400-\u9fff]+.*$/g,'').substr(0,5);
        else setrulerline(ukey)
    }
}
const renderKeyword=({text,ukey})=>{
    if (!cursorword)return text;
    let best=0;
    for (let i=1;i<=cursorword.length;i++) {
        if (text.indexOf(cursorword.substr(0,i))==-1) break;
        else best=i;
    }
    if (best) {
        const reg=new RegExp(cursorword.substr(0,best),'iug');
        text=text.replace(reg, m=>'<span class="cursorword">'+m+'</span>');
    }

    if ($tofind && $tofind!==cursorword) {
        const reg=new RegExp($tofind,'iug');
        text=text.replace(reg, m=>'<span class="highlight">'+m+'</span>');
    }
    lastUkey=ukey;
    return text;
}
const inputkeyup=async evt=>{
    if (evt.key=='Enter') {
        $tofind=cursorword;
        await tick();
        scrollindex=0;
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
$: leftcaption= $tofind?($tofind+'('+$srcexcerpts.length+')'):'';
</script>
<svelte:options accessors/>
<div class="logger">
    <div class="controls">
    <Btn icon='ruler' disabled={!rulerline} title={rulerline} onclick={torulerline} />
    <input type=number style="width:4em" bind:value={scrollindex} />
    <Btn icon="totop" onclick={totop}/>

    <input bind:value={cursorword} title='↑Prev  ↓Next  ⮠ Search' on:keyup={inputkeyup} />
    <Btn disabled={!cursorword} onclick={nextoccur} icon='rightanglearrow'/>
    <Btn disabled={!$tofind}  onclick={cleartofind} {leftcaption} icon="deletecancel"/>

    </div>
    <VirtualScroll bind:this={vs} keeps={50} data={items} key="ukey" let:data>
        {#key cursorword}
        {#if rulerline && rulerline===data.ukey }
        <div class="ruler"><span>{@html Icons.ruler}</span></div>
        {/if}
        <div class="linetext"
             class:clickable={$texttoc[data.ukey] } 
             on:click={()=>gotoc(data.ukey)} style="height:{data.height}px">
            <span class="itemindex">{paranum(data)}</span>
            <span index={data.ukey}>{@html renderKeyword(data)}</span>
        </div>
        {/key}

    </VirtualScroll>

</div>
<style>
:global(.cursorword) {color:rgb(255, 185, 105)}
:global(.highlight) {color:var(--highlight)}
:global(.linetext) {padding-bottom:5px;padding-top:5px;line-height:1.8;}

.controls {background : var(--panel-background)}
.clickable {cursor:pointer;color:var(--highlight)}
.ruler {height:1em;border-top:3px dotted var(--highlight)}
.logger {height:calc(100vh - 2em);  }
.itemindex {font-size:50%;color:gray;}
</style>
