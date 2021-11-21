<script>
import PitakaList from './pitakalist.svelte';
import SearchBar from './searchbar.svelte';
import SearchHelp from './searchhelp.svelte';
import {searchhelp} from './js/store.js';
import { pool } from 'pitaka/basket';
</script>

<div class="container">
<div class="controlbar">
    <SearchBar pitakas={pool.getAll()}/></div>
    {#if $searchhelp}
    <SearchHelp/>
    {:else}
    <PitakaList/>
    {/if}
</div>

