<script>
import { debounce } from 'pitaka/utils';

import {getContext} from 'svelte';
import { writable } from 'svelte/store';
import Btn from './comps/button.svelte'
 
const viewstore=getContext('viewstore');
const store=writable($viewstore.filteron);
$: $viewstore.filteron=!!$store;
const filterinput=()=>{
    $viewstore.linetofind=filterword;
    $store=true;
}
let filterword=$viewstore.linetofind||'';
</script>
<Btn {store} icon="filter"/>
<input class="tofind" bind:value={filterword} on:input={debounce(filterinput,250)} />
<style>
    .tofind {width:7em;padding-left:5px}
</style>