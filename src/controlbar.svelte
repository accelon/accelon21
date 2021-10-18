<script>
import Btn from './button.svelte';
import TocBar from './tocbar.svelte';
import SearchBar from './searchbar.svelte';
import TabSelector from './tabselector.svelte';
let showsetting=false;

const togglesetting=()=>{
    showsetting=!showsetting;
}
export let tabid;

</script>
<div id="controlbar">
    <TabSelector {tabid}/>
    <TocBar/>
    <Btn icon="menu" onclick={togglesetting} />
    {#if showsetting}
        <Btn icon="bookmark"/>
        <Btn icon="markerpen"/>
        <Btn icon="usernote"/>
    {/if}
    
</div>

<style>

    #controlbar { font-size:1rem;
      -webkit-user-select: none;  width:100%; background:var(--panel-background)}
</style>