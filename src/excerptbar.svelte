<script>
import {getContext} from 'svelte'
import {showFrontPage} from './js/store.js';
import Btn from './comps/button.svelte';
import TabSelector from './tabselector.svelte';
import ExcerptStat from './excerptstat.svelte';
import {selectorShown} from './js/addresses';
export let ptk;
export let side=0;
export let excerpts=[];
export let filterheadings={};
export let showheading;

</script>
<div class="controlbar">
    {#if side===0}<Btn icon="search" store={showFrontPage} />{/if}
    <TabSelector {side}/>
    <slot></slot>
    {#if ptk && excerpts.length && !showheading}
    <ExcerptStat {ptk} {side} {excerpts} bind:filterheadings />
    {/if}
</div>
