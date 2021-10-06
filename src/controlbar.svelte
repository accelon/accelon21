<script>
    import Btn from './button.svelte';
    import TocBar from './tocbar.svelte';
    import SearchBar from './searchbar.svelte';
    import {parseHook} from 'pitaka/offtext'
    import {setSelection} from './js/selection.js';
    import {column,cols,vstates,targetcolumn,texthook} from './js/store.js'
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
const markhook=()=>{
    const y=$texthook.y;
    const linetext=ptk.getLine(y);
    const {x,w,lead,leadn,end,endn}=parseHook($texthook.hook,linetext);

    const snips=document.querySelectorAll('t[y="'+y+'"]');
    let startnode=null,endnode=null,sx,ex;
    
    for (let i=0;i<snips.length;i++) {
        const snip=snips[i];
        const X=parseInt(snip.attributes.x.value);
        if (x> X) {startnode=snip; sx=x-X; }
        if (x+w> X) {endnode=snip; ex=x+w-X;}
    }
    setSelection(startnode,sx,endnode,ex);
    startnode.scrollIntoView();
}
</script>
<div id="controlbar">
    <Btn icon="target" disabled={$targetcolumn!==col} onclick={setTargetColumn}/>
    <TocBar {ptk} {col}/>
    
    <SearchBar/><span on:click={markhook}>{$texthook.col==col?$texthook.hook:''}</span>
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