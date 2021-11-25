<script>
import { parsePointer } from 'pitaka/offtext';
import { debounce } from 'pitaka/utils';
import {getContext} from 'svelte';
import { writable,get } from 'svelte/store';
import Btn from './comps/button.svelte'
import {setActiveline, setLocAttrs} from './js/addresses.js'
const vstore=getContext('vstore');
const addresses=getContext('addresses');
const filterusernote=writable(false);
const filterbookmark=writable(0);
import filterfunc from './js/linefilters.js';

const filters=[filterusernote,filterbookmark];
const uncheckall=(me,scroll=true)=>{
    filters.forEach(filter=>(filter!==me)&&filter.set(false));
}
const filteroff=()=>{
    $vstore.filterfunc=null;
}

$: if ($filterbookmark) {
    $vstore.filterfunc=filterfunc.bookmark;
    uncheckall(filterbookmark);
} 

$: if ($filterusernote) {
    uncheckall(filterusernote);
    $vstore.filterfunc=filterfunc.usernote;
}  else if ($vstore.filterfunc==filterfunc.usernote) filteroff();


const filterinput=()=>{
    if (!linetofind)return;
    $vstore.filterfunc=filterfunc.tofind;   
    setLocAttrs(addresses,{ltf:linetofind});
    filtertofind.set(true);
    uncheckall(filtertofind,false);
    $vstore.linetofind=linetofind;
}
const getbookmarkicon=()=>{
    return $filterbookmark==2?'bookmarksolid':'bookmark';
}

let linetofind=parsePointer($addresses[0].address).attrs.ltf;
</script>
<Btn store={filterbookmark} state={3} icon={getbookmarkicon()}/>
<Btn store={filterusernote} icon="usernote"/>
<input class="tofind" bind:value={linetofind} on:input={debounce(filterinput,250)} />
<style>
    .tofind {width:6em;padding-left:5px}
</style>