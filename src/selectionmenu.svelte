<script>
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import Btn from './comps/button.svelte'
import {cursorAddress,getCursorAddress} from './js/address.js'
import {saveNote} from './js/usernotes.js';

const onselectionchange=(evt)=>{
    selectedText='';
    const touches=evt.changedTouches;
    if (touches && touches.length!==1) return;
    if (evt.target.tagName!=='T')return;
    menuEle.style.left=evt.clientX+'px';
    menuEle.style.top=evt.clientY+'px';
    selectedText=getSelection().toString();
}
let selectedText='';
let menuEle;
onMount(()=>{
    document.addEventListener('mouseup', onselectionchange, false);
    document.addEventListener('touchend', onselectionchange, false);
})
async function copyaddress (){
    await navigator.clipboard.writeText(getCursorAddress());
    selectedText='';
}
const newnote=()=>{
    const {usernotes,dy,y,hook,loc,ptk} = get(cursorAddress);
    let notes=get(usernotes);
    let locnote=notes[dy]||[];
    const note={hook,text:'',marker:1,br:false};
    locnote.push(note);
    const newobj={...notes,[dy]:locnote};
    usernotes.set( newobj);
    saveNote({ptk,y,loc,...note},'add');
}
</script>
<div bind:this={menuEle} class="selectionmenu" class:visible={!!selectedText}>
<Btn icon="usernote" onclick={newnote}/>
<Btn icon="search"/>
<Btn icon="filter"/>
<Btn icon="copy" onclick={copyaddress}/>
</div>

<style>

    .visible {visibility: visible;}
</style>
