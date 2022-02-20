<script>

import sb from './js/searchbox.js';
import {searchbox} from './js/store.js'
import InputNumber from './comps/inputnumber.svelte';
/* todo , use comps/hamburgermenu  */
export let ptk=null;
let showing=true; 
export let scrollStart=0;

</script>
<span class="hamburger" class:showing on:click={()=>showing=!showing}>☰</span>
{#if showing}
<div class="dropdownpanel" title={scrollStart}>
<svelte:component this={$searchbox[ptk.format]||$searchbox.toc} {ptk}/>
</div>
{/if}