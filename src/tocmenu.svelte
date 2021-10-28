<script>

import sb from './js/searchbox.js';
import {searchbox } from './js/store.js'
import InputNumber from './comps/inputnumber.svelte';
import {fade,fly,slide} from 'svelte/transition';

import {getContext, onMount, tick} from 'svelte';
import {debounce} from 'pitaka/utils'
const viewstore=getContext('viewstore');
export let ptk=null;
let showing=true; 

export let scrollStart=0;

</script>
<span class="hamburger" on:click={()=>showing=!showing}>☰</span>
{#if showing}
<div class="dropdownpanel">

<svelte:component this={$searchbox[ptk.format]||$searchbox.toc} {ptk}/>

</div>
{/if}