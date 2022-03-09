<script>
import { createEventDispatcher } from 'svelte';
import Btn from './comps/button.svelte'
import {renderer} from './js/store.js'

const dispatch=createEventDispatcher();

export let attrs={}, opening=false;
export let text='',name='',w=0,ptk=null,i=0,clss='',x=0,y=0,starty=0,nesting=0; //just for hidding the warning
$:text,name,w,ptk,i,clss,x,y,starty,nesting;
let editing=false;
let deletable=false;
let input;
let breakable=!attrs.br;
function focus(ele){
    deletable=!ele.value;
    ele.focus();
}
function keyup(evt){
    if (evt.key==='Enter' && !attrs.br) {
        editdone();
    }
    breakable=evt.target.value.indexOf('\n')===-1
    deletable=!evt.target.value;
}

function setmarker(marker){
    if (attrs.marker!==marker) {
        attrs.marker=marker;
        editdone(true);
        input.focus();
        return;
    }
    editdone(); //leave editor
}
function removenote(){
    editing=false;
    dispatch('update',{ hook:attrs.hook, marker:-1})
}
function editdone(_editing=false){
    dispatch('update',{ hook:attrs.hook, marker:attrs.marker, text:input.value, br:!!attrs.br})
    editing=_editing;
}
$: lines= attrs.text.split(/\r?\n/).map((text,key)=>{return {key,text}});
</script>
{#if !opening}
{#if editing}
{#if deletable}<Btn icon="deletecancel" onclick={removenote} />{/if}
{#each [1,2,3,4,5] as mrk}
<span on:click={()=>setmarker(mrk)} 
    class={"clickable marker"+mrk}>{attrs.marker==mrk?"✔":"　"}</span>
{/each}
{#if breakable}
<span class='clickable' on:click={()=>attrs.br=!attrs.br}>⮠</span>
{/if}
<br/>
{#if !!attrs.br}
<textarea class='editor' rows={5} bind:this={input} on:keyup={keyup} use:focus maxlength={2000} value={attrs.text}/>
{:else}
<input class='editor' bind:this={input} on:keyup={keyup} value={attrs.text} use:focus maxlength={100}/>
{/if}
<br/>

{:else}
    {#if !attrs.text && !attrs.br}
        <Btn onclick={()=>editing=true} icon="usernote"/>
    {:else}
        {#if !!attrs.br}
            <Btn onclick={()=>editing=true} icon="usernote"/>
            <span class={"ruler marker"+attrs.marker}></span>
            <svelte:component this={$renderer._lines} {lines}/>
            <span class={"ruler marker"+attrs.marker}></span>
        {:else}
            <span on:click={()=>editing=true} class={"clickable marker"+attrs.marker}>{attrs.text}</span>
        {/if}
    {/if}
{/if}
{/if}
<style>
    .ruler {width:95%;display:block}
    .editor {width:95%;margin-left:0.5em;margin-right:0.5em}
</style>