<script>
import {getContext} from 'svelte';
import BacklinkGroup from './backlinkgroups.svelte';
import {tosim} from './js/store.js';
import  {settab} from './js/addresses.js';
import {toSim} from 'lossless-simplified-chinese';
export let text='';
export let ptk='';
export let loc='';

const viewstore=getContext('viewstore');

$: backlinkCount=ptk.backlinkCount(loc);

</script>
<div><span class="tocitem" on:click={()=>settab({loc})}>{toSim(text,$tosim)}</span>
<BacklinkGroup counts={backlinkCount} {ptk} {loc}/>
</div>

<style>
    .tocitem {cursor:pointer}
    .tocitem:hover{color:var(--highlight)}
</style>