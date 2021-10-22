<script>
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import InputNumber from './comps/inputnumber.svelte';
import {fade,fly,slide} from 'svelte/transition';
import {getContext, onMount, tick} from 'svelte';
const viewstore=getContext('viewstore');
export let ptk=null;
let showing=true;
let value=1;
export let scrollStart=0;
let selectedKeyword={}

$: keywords=ptk&&Object.keys(ptk.getLabel('bk').keywords) ;

const setKeyword= (label,keyword)=>{
    $viewstore.criteria={[label]:keyword};
}

</script>
<span class="hamburger" on:click={()=>showing=!showing}>☰</span>
{#if showing}
<div class="dropdownpanel">
Vol:<InputNumber bind:value max="55" min="1" />
Page:<InputNumber bind:value max="1000" min="1" />
{#each keywords as label }
<AutoComplete 
bind:selectedItem={$viewstore.criteria[label]}
inputId={"autocomplete_"+label} showClear={true} items={ptk.getLabel(label).keys} placeholder={ptk.getLabel(label).caption}
 onChange={value=>setKeyword(label,value)}/>
{/each}
</div>
{/if}