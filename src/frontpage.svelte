<script>
import PitakaList from './pitakalist.svelte';
import SearchBar from './searchbar.svelte';
import SearchHelp from './searchhelp.svelte';
import {searchhelp} from './js/store.js';
import { pool } from 'pitaka/basket';
export let hidden=false;
export let side=0;
</script>

<div class="container"  class:hidden>
<div class="controlbar">
    <SearchBar pitakas={pool.getAll()}/></div>
    {#if $searchhelp}
    <SearchHelp/>
    {:else}
    <PitakaList {side}/>
    {/if}
</div>

