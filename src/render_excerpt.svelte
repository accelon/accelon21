<script>
import {_,tosim, renderer} from './js/store.js';
import HumanAddr from './comps/humanaddr.svelte'
export let key=0;
export let y=0;
export let ptk=null;
export let loading=false;
export let score=0,ncl=0;
</script>
<div>
<span class='excerptheader'>{key+1}.<span class='bookid'>{ptk.clusterOf(y).id}</span> <HumanAddr {ptk} locOnly={true} address={ptk.locOf(y,true)}/></span>
{#if !loading}<svelte:component this={$renderer.default} {y} {ptk} loc={ptk.locOf(y)} />{/if}
</div>