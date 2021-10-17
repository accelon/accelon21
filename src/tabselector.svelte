<script>
import {addresses, gotab ,cleartab} from './js/store.js'
import Btn from './button.svelte';
export let tabid;
let showing=false;
const gototab=i=>{
    if (i==tabid) showing=false;
    else gotab(i);
}
</script>
<span title="Hotkey : Ctrl+Num" class="tabid" on:click={()=>showing=!showing}>{tabid}</span>
{#if showing}
<div class="pulldown">
    {#each $addresses as address,idx}
    <div class="address" on:click={()=>gototab(idx)}>
        <span class:active={tabid==idx} class="tabid">{idx}</span>
        <span class="addr">{address}</span>
        {#if address.length>1}<Btn icon="deletecancel" onclick={()=>cleartab(idx)}/>{/if}
    </div>
    {/each}
</div>
{/if}
<style>
    .active {color:var(--highlight)}
    .address {background:var(--menubackground);cursor:pointer}
    .pulldown {position:absolute;}
    .tabid {padding-left:3px;padding-right:3px;
        font-weight: bolder;
        font-family: 'Courier New', Courier, monospace;
        border:1px solid var(--button-selected)}
    .tabid:hover{color:var(--highlight)}
    .addr:hover{color:var(--highlight)}
</style>