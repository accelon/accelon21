<script>
import {_,tosim} from './js/store.js';
import {getContext} from 'svelte'
import {gotab, settab} from './js/addresses.js';
import InputNumber from './comps/inputnumber.svelte';

const viewstore=getContext('viewstore');

$: ptk=$viewstore.ptk;
$: loc=$viewstore.loc;
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc))||[];
const addresses=getContext('addresses');

$: childcount=ptk&&ptk.childCount(loc) ;
$: value=loc&&parseInt(loc.match(/(\d+)$/)[1]);

const go=({ctrlKey,detail})=>{
    const newloc='/'+ptk.name+'/'+loc.replace(/\d+$/,detail);
    settab(newloc,{addresses,newtab:ctrlKey});
}
const gotoc=evt=>{
    const ptr=evt.target.attributes.ptr.value;
    settab({loc:ptr, referer:loc},{addresses,newtab:evt.ctrlKey});
}
</script>

{#key $tosim}
{#each toctree as tocnode,idx}
<span class="tocitem" ptr={tocnode.ptr} on:click={gotoc}>
{idx?'/':''}{_(tocnode.name)}</span>
{/each}
{#if childcount>1}
<InputNumber on:change={go} autofocus={true} {value} max={childcount} min="1" />
{/if}
{/key}
<style>
    span.tocitem {cursor:pointer}
    span.tocitem:hover{color:var(--highlight)}
</style>