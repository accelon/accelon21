<script>
import {tosim} from './js/store.js';
import {toSim} from 'lossless-simplified-chinese'
import {getContext} from 'svelte'
import {setLoc} from './js/store.js';
const viewstore=getContext('viewstore');

$: ptk=$viewstore.ptk;
$: loc=$viewstore.loc;
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc))||[];

</script>
{#each toctree as tocnode,idx}
<span class="tocitem" loc={tocnode.loc} on:click={()=>setLoc({loc:tocnode.loc},viewstore)}>
{idx?'/':''}{toSim(tocnode.name,$tosim)}</span>
{/each}
<style>
    span[loc] {cursor:pointer}
    span[loc]:hover{color:var(--highlight)}
</style>