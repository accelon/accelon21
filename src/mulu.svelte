<script>
import { getContext } from 'svelte';
import { settab,setActiveLine } from './js/addresses';
import {_,tosim} from './js/store.js';
import LineFilter from './linefilter.svelte';

const vstore=getContext('vstore');
export let mulu=[];
export let scrollStart=0;
export let y0=0;
export let side=0;

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
    setActiveLine(side, y,y0);
    $vstore.scrollToY(y,true);
}
let showmode=1; //0 = always off , 1=auto on , 2=always on

const AUTOMENULINE=5;
const setshowmode=evt=>{
    if (showing) {
        if (scrollStart<AUTOMENULINE) showmode=0;//user want to turn off
        else showmode=1;               //auto off
    } else {
        showmode=2; 
    }
}
$: showing = (scrollStart<AUTOMENULINE && showmode==1) || showmode==2;
</script>
<span class="hamburger" class:showing on:click={setshowmode}>☰</span>
<LineFilter/>
{#if showing }
<div  class="dropdownpanel">
    {#key $tosim}
    {#each mulu as [level,name,itemy,addr] }
        <div class:upper={y0+scrollStart>itemy} class="item" 
            style={"padding-left:"+((level-1)*3)+"px;color:"+color(level,addr)}>
        
        {#if addr}
        <span class="external" lnk={addr} on:click={golink}>{_(name,$tosim)}
        →{caption(addr)}</span>
        {:else}
        <span 
        {itemy} on:click={scrolltotocitem}>{_(name)}</span>
        {/if}
        
        </div>
    {/each}
    {/key}
</div>
{/if}

<style>
    .upper {opacity:0.5}
    :global(.showing) {color:var(--highlight)}
    .external{font-size:80%}
    .external:hover{background:var(--button-unselected)}
    .item:hover{text-decoration: underline;cursor:pointer}


</style>