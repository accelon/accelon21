<script>
import {get} from 'svelte/store'
import {vscrollitems,loadTextItems,toiast,tofind,activeline} from './js/providentstore.js'
import Btn from './comps/button.svelte'
import { debounce } from 'pitaka/utils';
import {fromIAST} from 'provident-pali'
import CheckBox from './comps/checkbox.svelte';
let savetime='',errormsg='',linetofind='',act=1;

const filterinput=()=>{
    const tf=$toiast?fromIAST(linetofind):linetofind;
    tofind.set(tf);
}

const openfile=async ()=>{
    const [fileHandle]=await showOpenFilePicker();
    const file = await fileHandle.getFile();
    const content=await file.text();
    
    errormsg='';
    loadTextItems(content);
}

</script>
<span class='spacing'/>
<a target="_new" href="#">New</a><Btn onclick={openfile} icon="openfile"/>
<CheckBox store={toiast} label="IAST"/>
<input bind:value={linetofind} on:input={debounce(filterinput,250)}/>
{$vscrollitems.length}
<input type='number' bind:value={$activeline} min={1} max={$vscrollitems.length}/>
<style>
</style>