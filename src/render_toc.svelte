<script>
import {getContext} from 'svelte';
import BacklinkGroup from './backlinkgroups.svelte';
import {_,tosim} from './js/store.js';
import  {settab} from './js/addresses.js';
import InputNumber from './comps/inputnumber.svelte';

export let text='';
export let ptk='';
export let loc='';
export let id='';
export let childcount=0;
let value=childcount;
$: nchild=ptk.getNChild(loc,value-1) ;
const addresses=getContext('addresses');
$: backlinkCount=ptk.backlinkCount(loc);
const setjuan=({detail})=>{
    value=detail;
}
</script>
{#key $tosim}
<div>
    <span class="bookid">{id}</span>
    <span class="tocitem" on:click={evt=>settab({loc:loc+'/:0'},{addresses,newtab:evt.ctrlKey})}>
    {_(text)}</span>
{#if childcount>1}
<InputNumber on:change={setjuan} {value} max={childcount} min={1}/>
<span class="tocitem" on:click={evt=>settab({loc:nchild.ptr},{addresses,newtab:evt.ctrlKey})}>{nchild.name}</span>
{/if}
<BacklinkGroup counts={backlinkCount} {ptk} {loc}/>
</div>
{/key}
<style>
    :global(.juaninput) {width:2.5em}
    :global(.tocitem) {cursor:pointer}
    :global(.tocitem:hover) {color:var(--highlight)}
    
</style>