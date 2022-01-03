<script>
//render lines from various pitaka
import {renderer } from './js/store.js';
export let nesting=0;
export let lines=[];
export let ptk=null;
</script>

{#each lines as data}
<svelte:component {ptk} {nesting} this={$renderer[data.renderer]||$renderer.default} {...data}/>
{/each}