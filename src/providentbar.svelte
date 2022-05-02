<script>
import {get} from 'svelte/store'
import {vscrollitems,loadTextItems,toiast,tofind,activeline,cursorword} from './js/providentstore.js'
import Btn from './comps/button.svelte'
import { debounce } from 'pitaka/utils';
import {fromIAST} from 'provident-pali'
import {getCursorWord} from './js/selection.js'
import CheckBox from './comps/checkbox.svelte';
let savetime='',errormsg='',linetofind='',act=1;

document.onkeydown = keyDownEvent;

function keyDownEvent(event) {
    var key = event.key;
    if (!event.ctrlKey) return;

    if(key=='s') {
        settofind();
        event.preventDefault();
    } else if (key=='i') {
        toiast.set(!$toiast);
        event.preventDefault();
    } else if (key=='r') {
        refresh();
        event.preventDefault();
    } else if (key=='o') {
        openfile();
        event.preventDefault();
    }
}

const filterinput=()=>{
    const tf=$toiast?fromIAST(linetofind):linetofind;
    tofind.set(tf);
}
let fileHandle=null;
const openfile=async ()=>{
    [fileHandle]=await showOpenFilePicker();
    refresh();
}
const refresh=async()=>{
    const file = await fileHandle.getFile();
    const content=await file.text();
    errormsg='';
    loadTextItems(content);    
}
const settofind=()=>{
    let w=$cursorword;
    if ($toiast) w=fromIAST(w);
    if ($tofind!==w&&w) tofind.set(w)
    else tofind.set('')
}
$: $toiast, cursorword.set('')
</script>
<span class='spacing'/>
{#if fileHandle}
<a target="_new" href="#n">New</a>
<button on:click={refresh} title="ctrl+r">Refresh</button>
{:else}
<Btn onclick={openfile} title="ctrl+o" icon="openfile"/>
{/if}
<CheckBox store={toiast} title="ctrl+i toggle" label="IAST"/>
<input bind:value={linetofind} on:input={debounce(filterinput,250)}/>
{$vscrollitems.length}
<input type='number' bind:value={$activeline} min={1} max={$vscrollitems.length}/>
<button on:click={settofind} class={$toiast?"iast":"provident"}>{$cursorword}</button>
<style>
</style>