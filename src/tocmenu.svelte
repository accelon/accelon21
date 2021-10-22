<script>
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import InputNumber from './comps/inputnumber.svelte';
import {fade,fly,slide} from 'svelte/transition';
import {_} from './js/store.js';
import {getContext, onMount, tick} from 'svelte';
import {debounce} from 'pitaka/utils'
const viewstore=getContext('viewstore');
export let ptk=null;
let showing=true; 

export let scrollStart=0;
let selectedKeyword={}

$: keywords=ptk&&Object.keys(ptk.getLabel('bk').keywords) ;

const setKeyword= (label,keyword)=>{
    $viewstore.criteria={[label]:keyword};
}
let value='';
const bkinput=()=>{
    $viewstore.partial=value;
}
</script>
<span class="hamburger" on:click={()=>showing=!showing}>☰</span>
{#if showing}
<div class="dropdownpanel">

<input class="namefilter" placeholder={_("書名 BookName")} size="12em" bind:value on:input={debounce(bkinput,250)}/>
{#each keywords as label }
<AutoComplete 
bind:selectedItem={$viewstore.criteria[label]}
inputId={"autocomplete_"+label} showClear={true} items={ptk.getLabel(label).keys} placeholder={ptk.getLabel(label).caption}
 onChange={value=>setKeyword(label,value)}/>
{/each}
</div>
{/if}
<style>
    .namefilter {font-size:1.1rem;padding-left:5px}
</style>