<script>
//render lines from various pitaka
import {renderer } from './js/store.js';

export let nesting=0;
export let lines=[];
</script>

{#each lines as data}
<svelte:component  {nesting} this={$renderer.default} {...data}/>
{/each}