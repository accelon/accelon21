<script>
import {tosim} from './js/store.js';
import {toSim} from 'lossless-simplified-chinese'
import {getContext} from 'svelte'
import {settab} from './js/addresses.js';
const viewstore=getContext('viewstore');

$: ptk=$viewstore.ptk;
$: loc=$viewstore.loc;
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc))||[];

</script>
{#each toctree as tocnode,idx}
<span class="tocitem" loc={tocnode.loc} on:click={()=>settab({loc:tocnode.ptr})}>
{idx?'/':''}{toSim(tocnode.name,$tosim)}</span>
{/each}
<style>
    span[loc] {cursor:pointer}
    span[loc]:hover{color:var(--highlight)}
</style>