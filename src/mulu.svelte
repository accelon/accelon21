<script>
import { getContext } from "svelte";
import { settab } from "./js/addresses";
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
const addresses=getContext('addresses');
export let mulu=[];
export let scrollStart=0;
export let y0=0;
let showing=false;

let color=(level,external)=>'hsl('+((level)*40) +' ,80%,'+(external?'35%)':'50%)') ;
let caption=(lnk)=>{
    const chunk=lnk[1];
    if (chunk[0]==':') return parseInt(chunk.substr(1))+1;
    else return chunk;
}
const golink=evt=>{
    const lnk=evt.target.attributes.lnk.value;
    settab( {loc:lnk}, {addresses,newtab:evt.ctrlKey});
}
const scrolltotocitem=evt=>{
    const y=evt.target.attributes.itemy.value;
    dispatch('scrollTo',{y});
}
</script>

<span class="hamburger" class:showing on:click={()=>showing=!showing}>☰</span>
{#if showing || scrollStart==0}
<div  class="dropdownpanel">
    {#each mulu as [level,name,itemy,addr] }
        <div class:upper={y0+scrollStart>itemy} class="item" style={"padding-left:"+((level-1)*3)+"px;color:"+color(level,addr)}>
        {#if addr}
        <span class="external" lnk={addr.join('/')} on:click={golink}>{name}
        →{caption(addr)}</span>
        {:else}
        <span 
        {itemy} on:click={scrolltotocitem}>{name}</span>
        {/if}
        </div>
    {/each}
</div>
{/if}


<style>
    .upper {opacity:0.5}
    .showing {color:var(--highlight)}
    .external{font-size:80%}
    .external:hover{background:var(--button-unselected)}
    .item:hover{text-decoration: underline;cursor:pointer}
    :global(.dropdownpanel) {font-size:1rem;
        position:absolute;
        overflow-y:auto;
        padding-left:2px;padding-bottom:0.5em;height:50%;
        border-top-left-radius: 0.5em;
        border-bottom-left-radius: 0.5em;
        right:0;max-width:15em;background:var(--panel-background)}
    :global(.hamburger) {float:right;padding-right:2em}
    .mulubtn:hover {color:var(--highlight)}
</style>