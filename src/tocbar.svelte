<script>
export let ptk;
export let col;
let loc='';

import {vstates,vlines, setLoc} from './js/store.js';
$: vstate=vstates[col];
$: vl=vlines[col];
$: loc=$vstate.loc;
const click=async evt=>{
    const loc=evt.target.attributes.loc.value;
    setLoc(ptk,col,loc);
}
let toctree=[];
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc))||[];
</script>
{#each toctree as tocnode,idx}
<span class="tocitem" loc={tocnode.loc} on:click={click}>{idx?'/':''}{tocnode.name}</span>
{/each}
<style>
    span[loc] {cursor:pointer}
    span[loc]:hover{color:var(--highlight)}
</style>