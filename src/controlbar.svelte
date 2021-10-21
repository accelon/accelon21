<script>
import {getContext} from 'svelte'
import Btn from './button.svelte';
import TocBar from './tocbar.svelte';
import SearchBar from './searchbar.svelte';
import Mulu from './mulu.svelte';
import TocMenu from './tocmenu.svelte';
import TabSelector from './tabselector.svelte';
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

let showsetting=false;
export let scrollStart=0;
const viewstore=getContext('viewstore');
const togglesetting=()=>{
    showsetting=!showsetting;
}
$: mulu = $viewstore.mulu || [];
$: y0= $viewstore.y0;
export let tabid;
const scrollTo=({detail})=>{
    dispatch('scrollTo',detail);
}
</script>
<div class="controlbar">
    <TabSelector {tabid}/>
    <TocBar/>
    <Btn icon="menu" onclick={togglesetting} />
    {#if showsetting}
        <Btn icon="bookmark"/>
        <Btn icon="markerpen"/>
        <Btn icon="usernote"/>
    {/if}
    {#if mulu.length}
        <Mulu {mulu} {scrollStart} {y0} on:scrollTo={scrollTo}/>
    {:else}
        <TocMenu {scrollStart}/>
    {/if}
</div>

<style>

    :global(.controlbar){
        font-size:1rem;-webkit-user-select: none; 
        width:100%; 
        background:var(--panel-background)
    }
</style>