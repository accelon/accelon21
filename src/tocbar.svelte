<script>
import {_,tosim} from './js/store.js';
import {getContext} from 'svelte'
import {gotab, settab} from './js/addresses.js';
const viewstore=getContext('viewstore');

$: ptk=$viewstore.ptk;
$: loc=$viewstore.loc;
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc))||[];
const addresses=getContext('addresses');

$: childcount=ptk&&ptk.childCount(loc) ;
$: value=loc&&parseInt(loc.match(/:(\d+)/)[1])+1;

const go=()=>{
    const newloc='/'+ptk.name+'/'+loc.replace(/:\d+/,':'+(value-1));
    settab(newloc,addresses);
}
function setfocus(node){
    node.focus();
}
</script>

{#key $tosim}
{#each toctree as tocnode,idx}
<span class="tocitem" loc={tocnode.loc} on:click={()=>settab({loc:tocnode.ptr},addresses)}>
{idx?'/':''}{_(tocnode.name)}</span>
{/each}
{#if childcount}
<input class="juaninput" use:setfocus
 type='number' on:change={go} bind:value max={childcount} min="1"/>
{/if}
{/key}
<style>
    span.tocitem {cursor:pointer}
    span.tocitem:hover{color:var(--highlight)}
</style>