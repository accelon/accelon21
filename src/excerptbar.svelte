<script>
import {getContext} from 'svelte'
import {showFrontPage} from './js/store.js';
import Btn from './comps/button.svelte';
import TabSelector from './tabselector.svelte';
import ExcerptStat from './excerptstat.svelte';
import {closetab} from './js/addresses';
export let ptk;
export let side=0;
export let excerpts=[];
export let filterbooks={};
export let showbooklist;

const addresses=getContext('addresses');
</script>
<div class="controlbar">
    {#if side===0}<Btn icon="search" store={showFrontPage} />{/if}
    <span class='closetabbutton' on:click={()=>closetab(addresses)}>
        {$addresses.length}
    </span>
    <TabSelector/>
    <slot></slot>
    {#if ptk && excerpts.length && !showbooklist}
    <ExcerptStat {ptk} {side} {excerpts} bind:filterbooks />
    {/if}
</div>
