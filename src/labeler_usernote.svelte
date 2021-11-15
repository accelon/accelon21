<script>
import { createEventDispatcher } from 'svelte';
import Btn from './comps/button.svelte'

const dispatch=createEventDispatcher();

export let attrs={};
export let text='';
export let opening=false;
export let name='',w=0,ptk=null,i=0,clss,x,y,starty=0,nesting=0; //just for hidding the warning
let editing=false;
let deletable=false;
let input;
function focus(ele){
    deletable=!ele.value;
    ele.focus();
}
function keyup(evt){
    if (evt.key==='Enter') {
        editdone();
    }
    deletable=!evt.target.value;
}

function blur(evt) {
    // editing=false;
}
function setmarker(marker){
    attrs.marker=marker;
    editdone({marker});
    input.focus();
}
function removenote(){
    editing=false;
    dispatch('update',{ hook:attrs.hook, marker:-1})
}
function editdone(){
    dispatch('update',{ hook:attrs.hook, marker:attrs.marker, text:input.value})
    editing=false;
}
</script>
{#if !opening}
{#if editing}
{#if deletable}<Btn icon="deletecancel" onclick={removenote} />{/if}
{#each [1,2,3] as mrk}
<span on:click={()=>setmarker(mrk)} class={"clickable marker"+mrk}>{attrs.marker==mrk?"●":"　"}</span>
{/each}
<br/><input bind:this={input} on:blur={blur} on:keyup={keyup} value={attrs.text} use:focus maxlength=100/>
<br/>
{:else}
{#if !attrs.text}
<Btn onclick={()=>editing=true} icon="usernote"/>
{:else}
<span on:click={()=>editing=true} class={"clickable marker"+attrs.marker}>{attrs.text}</span>
{/if}
{/if}
{/if}
<style>
    input {width:95%;margin-left:0.5em;margin-right:0.5em}
</style>