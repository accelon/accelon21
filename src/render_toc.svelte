<script>
import {getContext} from 'svelte';
import BacklinkGroup from './backlinkgroups.svelte';
import {_,tosim} from './js/store.js';
import  {settab} from './js/addresses.js';
export let text='';
export let ptk='';
export let loc='';
export let childcount=0;
let value=childcount;
$: nchild=ptk.getNChild(loc,value-1) ;
const addresses=getContext('addresses');
$: backlinkCount=ptk.backlinkCount(loc);

</script>
{#key $tosim}
<div><span class="tocitem" on:click={()=>settab({loc:loc+'/:0'},addresses)}>
    {_(text)}</span>
{#if childcount>1}
<input class="juaninput" type='number' bind:value max={childcount} min="1"/>
<span class="tocitem" on:click={()=>settab({loc:nchild.ptr},addresses)}>{nchild.name}</span>
{/if}
<BacklinkGroup counts={backlinkCount} {ptk} {loc}/>
</div>
{/key}
<style>
    :global(.juaninput) {width:2.5em}
    :global(.tocitem) {cursor:pointer}
    :global(.tocitem:hover) {color:var(--highlight)}
</style>