<script>
import {createEventDispatcher, getContext} from 'svelte';
import BacklinkGroup from './backlinkgroups.svelte';
import {_,tosim, labeler} from './js/store.js';
import  {settab} from './js/addresses.js';
import InputNumber from './comps/inputnumber.svelte';
import Btn from './comps/button.svelte';
const dispatch=createEventDispatcher();
export let text='';
export let ptk='';
export let key=0;
export let ptr='';
export let id='';
export let keywords=[];
export let childcount=0;
let value=childcount;
const viewstore=getContext('viewstore');

$: nchild=ptk.getNChild(ptr,value-1) ;
const addresses=getContext('addresses');
$: backlinkCount=ptk.backlinkCount(ptr);
const setjuan=({detail})=>{
    value=detail;
}
const setkeyword=evt=>{
    const label=evt.target.attributes.label.value;
    const value=evt.target.innerText;
    $viewstore.criteria={[label]:value};
}
</script>
{#key $tosim}
<div>
    <span class="bookid">{id}</span>
    <span class="tocitem" on:click={evt=>settab(addresses,{loc:ptr+'/1'},{newtab:true})}>
    {_(text)}</span>
{#if childcount>1}
<InputNumber on:change={setjuan} {value} max={childcount} min={1}/>
<span class="tocitem" on:click={evt=>settab(addresses,{loc:nchild.ptr},{newtab:true})}>
{#if nchild.name}{nchild.name}
{:else}<Btn icon="read"/> 
{/if}
</span>
{/if}
<BacklinkGroup counts={backlinkCount} {ptk} loc={ptr}/>
{#each keywords as [label,caption]}
<t on:click={setkeyword} {label} class={"clickable "+ label}>{caption}</t>
{/each}
</div>
{/key}
<style>
    :global(.juaninput) {width:2.5em}
    :global(.tocitem) {cursor:pointer}
    :global(.tocitem:hover) {color:var(--highlight)}
    
</style>