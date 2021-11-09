<script>
import {debounce} from 'pitaka/utils'
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import {_} from './js/store.js';
import {getContext} from 'svelte'
let value='';
export let ptk;
const viewstore=getContext('viewstore');
$: keywords=(ptk&&ptk.getLabel('bk')&&Object.keys(ptk.getLabel('bk').keywords))||[] ;
let selectedKeyword={}
const setKeyword= (label,keyword)=>{
    $viewstore.criteria={[label]:keyword};
}
const bkinput=()=>{
    $viewstore.partial=value;
}
</script>
<input class="namefilter" placeholder={_("書名 BookName")} size="12em" 
bind:value on:input={debounce(bkinput,250)}/>


{#each keywords as label }
<AutoComplete 
bind:selectedItem={$viewstore.criteria[label]}
inputId={"autocomplete_"+label} showClear={true} items={ptk.getLabel(label).keys} placeholder={ptk.getLabel(label).caption}
 onChange={value=>setKeyword(label,value)}/>
{/each}

<style>
    .namefilter {font-size:1.1rem;padding-left:5px}
</style>