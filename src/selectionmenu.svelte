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
    const {usernotes,delta,y,hook,loc,ptk} = get(cursorAddress);
    let notes=get(usernotes);
    let locnote=notes[delta]||[];
    const note={hook,text:'',marker:1};
    locnote.push(note);
    const newobj={...notes,[delta]:locnote};
    usernotes.set( newobj);
    saveNote({ptk,y,loc,...note},'add');
}
</script>
<div bind:this={menuEle} class="menu" class:visible={!!selectedText}>
<Btn icon="usernote" onclick={newnote}/>
<Btn icon="search"/>
<Btn icon="copy" onclick={copyaddress}/>
</div>

<style>
    .menu {position:absolute;z-index: 999;
        -webkit-user-select: none; border-radius: 5px;
        background:var(--menubackground);visibility: hidden;}
    .visible {visibility: visible;}
</style>
