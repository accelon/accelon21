<script>
    import Btn from './button.svelte';
    import TocBreadCrumb from './tocbreadcrumb.svelte';
    import {column,cols,vstates,targetcolumn} from './store.js'
    let showsetting=false;
    const togglesetting=()=>{
        showsetting=!showsetting;
    }
    export let col=0;
    export let updateItems;
    export let tree='';

    const setTargetColumn=()=>{
        $targetcolumn++;
        if ($targetcolumn>$column) $targetcolumn=0;
    }
    $: vstate=vstates[col]||{};

</script>
<div id="controlbar">
    <Btn icon="target" disabled={$targetcolumn!==col} onclick={setTargetColumn}/>
    <TocBreadCrumb ptk={$vstate.ptk} {updateItems} {tree}/>
    <Btn icon="menu" onclick={togglesetting} />
    {#if showsetting}
        <Btn icon="bookmark"/>
        <Btn icon="markerpen"/>
        <Btn icon="usernote"/>
    {/if}

</div>

<style>

    #controlbar {-webkit-user-select: none;  width:100%}
</style>