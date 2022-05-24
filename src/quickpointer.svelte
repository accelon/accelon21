<script>
import { debounce } from 'pitaka/utils';
import { getContext } from 'svelte';
import { settab } from './js/addresses.js';
import {_,tosim} from './js/store.js'
export let isvalid={};
export let ptk=null;
export let side=0;
let value='';
let closestLabels=[];
export let lang=ptk && ptk.header.lang;

const oninput=()=>{
   closestLabels=ptk.parseQuickPointer(value);
   isvalid[ptk.name]=!!closestLabels.length || !!value.trim();
}
const read=y0=>{
    const loc=ptk.locOf(y0,true);
    settab(side,loc,{newtab:true});
}
</script>
<input bind:value on:input={debounce(oninput,250)} size={5}/>
{#if !closestLabels.length && value.trim()}
{_(lang,ptk.quickPointerSyntax(),$tosim)}
{/if}
{#each closestLabels as lbl}
{#if lbl.id}<span class="labeltext" label={_(lang,lbl.caption,$tosim)}>{lbl.id}</span>{/if}
{#if lbl.lblname=='bk' && lbl.name }<span class='clickable' on:click={()=>read(lbl.y0)}>{lbl.name}</span>{/if}
{/each}