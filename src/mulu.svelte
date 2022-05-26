<script>
import { getContext } from 'svelte';
import { settab,setActiveLine } from './js/addresses';
import {_,tosim,palitrans,picked} from './js/store.js';
import Hamburgermenu from './comps/hamburgermenu.svelte';
export let mulu=[];
export let scrollStart=0;
export let y0=0;
export let side=0;
export let ptk;
export let scrollToY=()=>{};
export let lang=ptk.header.lang;
$: scrollStart;
let color=(level,external)=>'hsl('+((level)*40) +' ,80%,'+(external?'35%)':'50%)') ;
let caption=(lnk)=>{
    const chunk=lnk[1];
    if (chunk[0]==':') return parseInt(chunk.substr(1))+1;
    else return chunk;
}
const golink=evt=>{
    const lnk=evt.target.attributes.lnk.value;
    settab( side,{loc:lnk}, {newtab:true});
}
const scrolltotocitem=evt=>{
    const y=parseInt(evt.target.attributes.itemy.value);
    // throw 'ptk not accessible yet'
    setActiveLine(ptk,side, y,y0);
   scrollToY && scrollToY(y,true);
}

</script>

<Hamburgermenu {scrollStart}>
    {#each mulu as [level,name,itemy,addr] }
        <div class:upper={y0+scrollStart>itemy} class="item" 
            style={"padding-left:"+((level-1)*3)+"px;color:"+color(level,addr)}>
        {#if addr}
        <span class="external" lnk={addr} on:click={golink}>{_(lang,name,$tosim,$palitrans,20)}
        →{caption(addr)}</span>
        {:else}
        <span 
        {itemy} on:click={scrolltotocitem}>{_(lang,name,$tosim,$palitrans,20)}</span>
        {/if}
        </div>
    {/each}
</Hamburgermenu>

<style>
    .upper {opacity:0.5}
    .external{font-size:80%}
    .external:hover{background:var(--button-unselected)}
    .item:hover{text-decoration: underline;cursor:pointer}
</style>