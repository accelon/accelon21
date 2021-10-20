<script>
import {getContext} from 'svelte'
import Btn from './button.svelte';
import TocBar from './tocbar.svelte';
import SearchBar from './searchbar.svelte';
import TabSelector from './tabselector.svelte';
let showsetting=false;
const viewstore=getContext('viewstore');
const togglesetting=()=>{
    showsetting=!showsetting;
}
$: mulu = $viewstore.mulu || [];
export let tabid;
let showing=true;
let color=(level,external)=>'hsl('+((level)*40) +' ,80%,'+(external?'35%)':'50%)');

</script>
<div class="controlbar">
    <TabSelector {tabid}/>
    <TocBar/>
    <span icon="menu" onclick={togglesetting} />
    {#if showsetting}
        <Btn icon="bookmark"/>
        <Btn icon="markerpen"/>
        <Btn icon="usernote"/>
    {/if}
    <span class="mulubtn" on:click={()=>showing=!showing}>☰</span>
    {#if showing}
    <div class="mulu">
        {#each mulu as mu }
            <div class:external={mu[2]} 
            style={"padding-left:"+((mu[0]-1)*3)+"px;color:"+color(mu[0],mu[2])}>
            {mu[1]} {#if mu[2]}→{/if}
            </div>
        {/each}
    </div>
    {/if}
</div>

<style>
    .external {font-size:80%}
    .mulu {font-size:1rem;position:absolute;overflow-y:auto;
        padding-left:2px;padding-bottom:0.5em;height:50%;
        border-top-left-radius: 0.5em;
        border-bottom-left-radius: 0.5em;
        right:0;max-width:20em;background:var(--panel-background)}
    .mulubtn {float:right;padding-right:2em}
    .mulubtn:hover {color:var(--highlight)}
    :global(.controlbar){
        font-size:1rem;-webkit-user-select: none; 
        width:100%; 
        background:var(--panel-background)
    }
</style>