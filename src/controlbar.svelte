<script>
    import Btn from './button.svelte';
    import TocBar from './tocbar.svelte';
    import SearchBar from './searchbar.svelte';
    let showsetting=false;
    const togglesetting=()=>{
        showsetting=!showsetting;
    }
    export let ptk;


</script>
<div id="controlbar">
    <TocBar {ptk}/>
    <SearchBar {ptk}/>
    <Btn icon="menu" onclick={togglesetting} />
    {#if showsetting}
        <Btn icon="bookmark"/>
        <Btn icon="markerpen"/>
        <Btn icon="usernote"/>
    {/if}
    
</div>

<style>

    #controlbar {   -webkit-user-select: none;  width:100%; background:var(--panel-background)}
</style>