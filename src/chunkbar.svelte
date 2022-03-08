<script>
import {getContext} from 'svelte'
import Btn from './comps/button.svelte';
import TocBar from './tocbar.svelte';
import SearchBar from './searchbar.svelte';
import Mulu from './mulu.svelte';
import TocMenu from './tocmenu.svelte';
import TabSelector from './tabselector.svelte';
import {closetab} from './js/addresses';
import {showFrontPage} from './js/store.js';
export let ptk
export let scrollStart=0,side=0;
const vstore=getContext('vstore');
const addresses=getContext('addresses');

$: mulu = $vstore.mulu || [];
$: y0= $vstore.y0;
$: loc= $vstore.loc;

</script>
<div class="controlbar">
    {#if side===0}<Btn icon="search" store={showFrontPage} />{/if}

    <span class='closetabbutton' on:click={()=>closetab(addresses)}>
        {$addresses.length}
    </span>
    <TabSelector {side}/>
    <TocBar {ptk} {loc} {side}/>
    {#if mulu&&mulu.length}
        <Mulu {ptk} {mulu} {scrollStart} {y0}/>
    {:else if ptk}
        <TocMenu {scrollStart} {ptk}/>
    {/if}
</div>

<style>
    :global(.controlbar){
        -webkit-user-select: none; 
        width:100%; 
        height:1.5rem;
        background:var(--panel-background)
    }
</style>