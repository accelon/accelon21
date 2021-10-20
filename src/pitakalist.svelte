<script>
import { pool} from 'pitaka';
import {_} from './js/store.js'
import { getContext } from 'svelte';
import { settab } from './js/addresses';
const addresses=getContext('addresses');
$: pitakas=pool.getAll();
</script>
{#each pitakas as ptk}
<div><span class="tocitem" on:click={settab('/'+ptk.name,addresses)}>
    {_(ptk.header.title)} ({ptk.bookCount()}) </span>
    {#if ptk.header.homepage}
    <a href={ptk.header.homepage} target=_new>www</a>
    {/if}
    {#if ptk.header.maintainer}
    <a href={"mailto:"+ptk.header.maintainer} target=_new>mail</a>
    {/if}
<div class="description">{_(ptk.header.description)||""}</div>
</div>
{/each}
<style>
    .description {padding-left:2em;font-size:0.8em}
</style>
