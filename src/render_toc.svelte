<script>
import {getContext} from 'svelte'
import BacklinkGroup from './backlinkgroups.svelte';
import {setLoc,tosim} from './js/store.js';
import {toSim} from 'lossless-simplified-chinese'
export let text='';
export let ptk='';
export let loc='';

const viewstore=getContext('viewstore');

$: backlinkCount=ptk.backlinkCount(loc);

</script>
<div><span class="tocitem" on:click={()=>setLoc({loc},viewstore) }>{toSim(text,$tosim)}</span>
<BacklinkGroup counts={backlinkCount} {ptk} {loc}/>
</div>

<style>
    .tocitem {cursor:pointer}
    .tocitem:hover{color:var(--highlight)}
</style>