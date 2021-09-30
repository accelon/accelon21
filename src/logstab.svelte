<script>
import { fromChineseNumber } from 'pitaka/utils';

import {logs,texttoc} from './store.js'
// import VirtualList from './virtualist'
import VirtualScroll from 'svelte-virtual-scroll-list'
import {getCursorWord} from 'kaigua'
$: items = $logs;
let vs , activeline=0 , scrollindex=0;
$: if(vs) {vs.scrollToIndex(scrollindex); activeline=scrollindex;}
const totop=()=>vs.scrollToIndex(0);
const toactiveline=()=>vs.scrollToIndex(activeline);
const paranum=({ukey,text})=>{
    if (ukey%5==0) return ukey;
    return text?'　':''; 
}
let cursorword;
const gotoc=ukey=>{
    const nline=$texttoc[ukey];
    if (nline) {
        vs.scrollToIndex(nline)
        activeline=nline;
    } else {
        const tf=getCursorWord().tofind;
        if(tf) cursorword=tf.replace(/[^\u3400-\u9fff]+.*$/g,'').substr(0,5);
        activeline=ukey;
    }
}
const renderKeyword=({text})=>{
    if (!cursorword)return text;
    let best=0;
    for (let i=1;i<=cursorword.length;i++) {
        if (text.indexOf(cursorword.substr(0,i))==-1) break;
        else best=i;
    }
    if (best>1) {
        const reg=new RegExp(cursorword.substr(0,best),'g');
        return text.replace(reg, m=>'<span class="highlight">'+m+'</span>');
    }
    return text;
}
</script>

<div class="logger">
    <input type=number style="width:5em" bind:value={scrollindex} />
    <button on:click={totop}>↑</button><button on:click={toactiveline}>{activeline}</button>
    <input bind:value={cursorword}/>
    <VirtualScroll bind:this={vs} keeps={50} data={items} key="ukey" let:data>
        {#key cursorword}
        <div class="linetext" class:activeline={activeline===data.ukey} 
             class:clickable={$texttoc[data.ukey] } 
             on:click={()=>gotoc(data.ukey)} style="height:{data.height}px">
            <span class="itemindex">{paranum(data)}</span>
            <span index={data.ukey}>{@html renderKeyword(data)}</span>
        </div>
        {/key}

    </VirtualScroll>

</div>
<style>
.clickable {cursor:pointer;color:var(--highlight)}
.activeline {border-top:1px dashed var(--highlight)}
.logger {height:calc(100vh - 2em);  }
.linetext {padding-bottom:5px;padding-top:5px}
:global(.highlight) {color:rgb(255, 185, 105)}
input#range {width:100%}
.vs {
    /* border-top: 1px solid #333;
    border-bottom: 1px solid #333; */
    /* min-height: 100px; */
    /* overflow-y:scroll; */
    height:500px;
    width:500px;
    /* height: calc(100vh-3em); */
}

.itemindex {font-size:50%;color:gray;}
</style>
