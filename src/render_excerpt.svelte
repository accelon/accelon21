<script>
import {_,tosim} from './js/store.js';
import HumanAddr from './comps/humanaddr.svelte'
export let key=0;
export let y=0;
export let score=0;
export let ptk=null;
export let loading=false;
</script>
<div class='linetext'>
{#key $tosim}
<span class='excerptheader'>{key} <HumanAddr {ptk} locOnly={true} loc={ptk.locOf(y)}/></span>
{#if !loading}{_(ptk.getLine(y))}{/if}
{/key}
</div>
<style>
.excerptheader {border:1px dashed sienna} 

</style>