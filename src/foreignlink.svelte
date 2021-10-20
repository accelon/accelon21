<script>

import {parsePointer} from 'pitaka/offtext'
import {tosim,renderer} from './js/store.js';
import {toSim} from 'lossless-simplified-chinese'
import { fetchHooks } from 'pitaka';
// export let count=0;
// export let ptk=null;
// export let link=null;
// export let from=null;
let renderer_foreignlink=null;
const parsed=parsePointer(link);
let showing=false;
let lines=[];
const toggle=async ()=>{
    showing=!showing;
    lines=[];
    if (!showing) return;

    lines=await fetchHooks(link);
    renderer_foreignlink=$renderer._lines;
}

</script>

<span><span class="foreignlink" class:showing on:click={toggle}>
{toSim(parsed.bk,$tosim)}{parsed.c?'/'+toSim(parsed.c,$tosim):''}
</span>
{#if renderer_foreignlink && lines.length}<div class="hr"></div>{/if}
<svelte:component this={renderer_foreignlink} {lines}/>
{#if renderer_foreignlink && lines.length}<div class="hr"></div>{/if}
</span>
<style>
    div.hr {border-top:1px solid var(--button-selected)}
    .showing {color:HighlightText;
        border-radius: 5px; 
        background:Highlight;font-weight: bold;}
    .foreignlink{font-size:85%;
        cursor:pointer;
        padding-left:0.2em;
        border-left:1px solid var(--button-unselected)}
    .foreignlink:hover{color:var(--highlight)}
</style>