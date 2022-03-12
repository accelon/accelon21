<script>
import {getContext} from 'svelte'
import {showFrontPage, _ ,tosim} from './js/store.js';
import Btn from './comps/button.svelte';
import TabSelector from './tabselector.svelte';
import ExcerptStat from './excerptstat.svelte';
import {closetab} from './js/addresses';
export let ptk;
export let side=0;
export let excerpts=[];
export let filterheadings={};
export let showheading;
const addresses=getContext('addresses');
const onclick=()=>{
    closetab(addresses);
}
</script>
<div class="controlbar">
    {#if side===0}<Btn icon="search" store={showFrontPage} />{/if}
    <TabSelector {side}/>
    <span title={_(ptk.header.title,$tosim)} class="closetabbutton" 
        on:click={onclick}>{ptk.header.name}</span>
    <slot></slot>
    {#if ptk && excerpts.length && !showheading}
    <ExcerptStat {ptk} {side} {excerpts} bind:filterheadings />
    {/if}
</div>
<style>
    .closetabbutton {padding-left:8px;padding-right:8px;cursor:pointer}
    .closetabbutton:hover:before {color:red;content:'✖';display:inline-block;width:0px} 
</style>