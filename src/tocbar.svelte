<script>
import {tosim} from './js/store.js';
import {toSim} from 'lossless-simplified-chinese'
import {getContext} from 'svelte'
import {settab} from './js/addresses.js';
const viewstore=getContext('viewstore');

$: ptk=$viewstore.ptk;
$: loc=$viewstore.loc;
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc))||[];
const addresses=getContext('addresses');
</script>
{#each toctree as tocnode,idx}
<span class="tocitem" loc={tocnode.loc} on:click={()=>settab({loc:tocnode.ptr},addresses)}>
{idx?'/':''}{toSim(tocnode.name,$tosim)}</span>
{/each}
<style>
    span.tocitem {cursor:pointer}
    span.tocitem:hover{color:var(--highlight)}
</style>