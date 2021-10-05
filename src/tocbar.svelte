<script>
export let ptk;
export let col;
export let address='';

import {vstates} from './store.js';
$: vstate=vstates[col];
$: address=$vstate.address;
const click=async evt=>{
    const address=evt.target.attributes.address.value;
    const items=ptk.fetch(address);
    await ptk.prefetchLines(items[0].key,items.length);
    vstate.set(Object.assign($vstate,{items,address}));
}
let toctree=[];
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(address))||[];
</script>
{#each toctree as tocnode,idx}
<span class="tocitem" address={tocnode.address} on:click={click}>{idx?'/':''}{tocnode.name}</span>
{/each}
<style>
    span[address] {cursor:pointer}
    span[address]:hover{color:var(--highlight)}
</style>