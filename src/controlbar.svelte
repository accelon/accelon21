<script>
import {getContext} from 'svelte'
import Btn from './comps/button.svelte';
import TocBar from './tocbar.svelte';
import SearchBar from './searchbar.svelte';
import Mulu from './mulu.svelte';
import TocMenu from './tocmenu.svelte';
import TabSelector from './tabselector.svelte';
import {closetab} from './js/addresses';
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
export let ptk

export let scrollStart=0;
const vstore=getContext('vstore');
const addresses=getContext('addresses');

$: mulu = $vstore.mulu || [];
$: y0= $vstore.y0;

const scrollTo=({detail})=>{
    dispatch('scrollTo',detail);
}

</script>
<div class="controlbar">
    <span class='closetabbutton' on:click={()=>$vstore.loc!=='/'&&closetab(addresses)}>
        {$addresses.length}
    </span>
    <TabSelector/>
    <TocBar/>
    <SearchBar/>
    {#if mulu.length}
        <Mulu {mulu} {scrollStart} {y0} on:scrollTo={scrollTo}/>
    {:else}
        <TocMenu {scrollStart} {ptk}/>
    {/if}
</div>

<style>
    :global(.controlbar){
        font-size:1rem;-webkit-user-select: none; 
        width:100%; 
        height:1.5rem;
        background:var(--panel-background)
    }
</style>