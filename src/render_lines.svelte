<script>
//render lines from various pitaka
import {renderer } from './js/store.js';
export let col=0;
export let lines=[];
</script>

{#each lines as data}
<svelte:component col={col} this={$renderer.default} {...data}/>
{/each}