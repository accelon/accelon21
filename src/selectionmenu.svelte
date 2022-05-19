<script>
import { onMount } from 'svelte';
import { get } from 'svelte/store';
import Btn from './comps/button.svelte'
import {cursorAddress,getCursorAddress} from './js/address.js'
import {saveNote} from './js/usernotes.js';
import {enumSearchSite} from './js/searchsites.js';
import {activetofind} from './js/query.js';
let lang='';
const onselectionchange=(evt)=>{
    const touches=evt.changedTouches;
    if (touches && touches.length!==1|| evt.target.tagName!=='T') {
        selectedText='';
        return;
    }

    const newselectedText=getSelection().toString();

    if (newselectedText!==selectedText) {
        menuEle.style.left=evt.clientX+ 'px';
        menuEle.style.top=(evt.clientY+20)+'px';
        selectedText=newselectedText;

        const {ptk} = get(cursorAddress);
        lang=ptk.header.lang;
    }
}
let selectedText='';
let menuEle;
onMount(()=>{
    document.addEventListener('click', onselectionchange, false);
    document.addEventListener('touchend', onselectionchange, false);
})
async function copy (){
    await navigator.clipboard.writeText(selectedText);
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

const gourl=(url)=>{
    window.open(url);
}

const dosearch=()=>{
    activetofind.set(selectedText);
}
</script>
<div bind:this={menuEle} class="selectionmenu" class:visible={!!selectedText}>
<Btn icon="copy" onclick={copy}/>
{#each enumSearchSite(selectedText,lang) as site}
<Btn icon={site.icon} onclick={()=>gourl(site.url)}/>
{/each}
</div>

<style>

    .visible {visibility: visible;}
</style>
