<script>
import {vstate} from './js/addresses.js';
import Btn from './comps/button.svelte'
export let y;
export let ptk;
export let loc;
</script>
<div>
<Btn icon="bookmark" />
{#if $vstate.len}
<Btn icon="usernode"/>
{:else}

{/if}
</div>