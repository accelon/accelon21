<script>
    import Btn from './button.svelte';
    import TocBar from './tocbar.svelte';
    import SearchBar from './searchbar.svelte';
    import {column,cols,vstates,targetcolumn} from './store.js'
    let showsetting=false;
    const togglesetting=()=>{
        showsetting=!showsetting;
    }
    export let col=0;
    export let ptk;
    const setTargetColumn=()=>{
        $targetcolumn++;
        if ($targetcolumn>$column) $targetcolumn=0;
    }
    $: vstate=vstates[col]||{};
$: address = $vstate.address;
</script>
<div id="controlbar">
    <Btn icon="target" disabled={$targetcolumn!==col} onclick={setTargetColumn}/>
    <TocBar {ptk} {col}/>
    
    <SearchBar/>
    <Btn icon="menu" onclick={togglesetting} />
    {#if showsetting}
        <Btn icon="bookmark"/>
        <Btn icon="markerpen"/>
        <Btn icon="usernote"/>
    {/if}
    
</div>

<style>

    #controlbar {
    -webkit-user-select: none;  width:100%; background:var(--panel-background)}
</style>