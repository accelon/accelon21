<script>
import {vstates,vlines} from './js/store.js';
import Btn from './button.svelte'
export let y;
export let col;
export let ptk;
export let loc;
$: vstate=vstates[col];

</script>
<div>
<Btn icon="bookmark" />
{#if $vstate.len}
<Btn icon="markerpen"/>
{:else}

{/if}
</div>