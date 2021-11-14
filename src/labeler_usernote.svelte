<script>
import { createEventDispatcher } from 'svelte';
import Btn from './comps/button.svelte'

const dispatch=createEventDispatcher();

export let attrs={};
let note=attrs.note;
export let text='';
export let opening=false;
export let name='',w=0,ptk=null,i=0,clss,x,y,starty=0,nesting=0; //just for hidding the warning
let editing=false;
let deletable=false;
function focus(ele){
    deletable=!note.text;
    ele.focus();
}
function keyup(evt){
    if (evt.key==='Enter') {
        editdone();
    }
    deletable=!evt.target.value;
}
let input;
function blur(evt) {
    // editing=false;
}
function setmarker(marker){
    note.marker=marker;
    dispatch('update',{note:attrs.note, marker})
    input.focus();
}
function removenote(){
    dispatch('update',{note:attrs.note, op:'remove'})
}
function editdone(){
    note.text=input.value;
    dispatch('update',{note:attrs.note, text:note.text})
    editing=false;
}
</script>
{#if !opening}
{#if editing}
{#if deletable}<Btn icon="deletecancel" onclick={removenote} />{:else}
{#each [1,2,3] as mrk}
<span on:click={()=>setmarker(mrk)} class={"clickable marker"+mrk}>{note.marker==mrk?"■":"□"}</span>
{/each}
<Btn icon="ok" onclick={editdone} />
{/if}
<br/><input bind:this={input} on:blur={blur} on:keyup={keyup} value={note.text} use:focus maxlength=100/>
<br/>
{:else}
{#if !note.text}
<Btn onclick={()=>editing=true} icon="usernote"/>
{:else}
<span on:click={()=>editing=true} class={"marker"+note.marker}>{note.text}</span>
{/if}
{/if}
{/if}
<style>
    input {width:95%;margin-left:0.5em;margin-right:0.5em}
</style>