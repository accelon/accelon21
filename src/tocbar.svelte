<script>
import {tosim} from './js/store.js';
import {toSim} from 'lossless-simplified-chinese'
export let ptk;
let loc='';
import {vstate,setLoc} from './js/store.js';

$: loc=$vstate.loc;
const click=async evt=>{
    const loc=evt.target.attributes.loc.value;
    setLoc(ptk,loc);
}
let toctree=[];
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc))||[];
</script>
{#each toctree as tocnode,idx}
<span class="tocitem" loc={tocnode.loc} on:click={click}>{idx?'/':''}{toSim(tocnode.name,$tosim)}</span>
{/each}
<style>
    span[loc] {cursor:pointer}
    span[loc]:hover{color:var(--highlight)}
</style>