<script>
import { parsePointer } from 'pitaka/offtext';
import { debounce } from 'pitaka/utils';
import {getContext} from 'svelte';
import { writable,get } from 'svelte/store';
import Btn from './comps/button.svelte'
import {setActiveline, setLocAttrs} from './js/addresses.js'
const vstore=getContext('vstore');
const addresses=getContext('addresses');
const filtertofind=writable($vstore.filteron);
const filterusernote=writable(false);
const filterbookmark=writable(false);
const filterbookmarksolid=writable(false);
import filterfunc from './js/linefilters.js';

const filters=[filtertofind,filterusernote,filterbookmark,filterbookmarksolid];
const uncheckall=(me,scroll=true)=>{
    filters.forEach(filter=>(filter!==me)&&filter.set(false));
}
const filteroff=()=>{
    $vstore.filterfunc=null;
}
$: if ($filtertofind) {
    if (linetofind.trim()) {
        $vstore.filterfunc=filterfunc.tofind;   
        uncheckall(filtertofind);
    } else uncheckall();
} else if ($vstore.filterfunc==filterfunc.tofind) filteroff();

$: if ($filterbookmark) {
    $vstore.filterfunc=filterfunc.bookmark;
    uncheckall(filterbookmark);
} else if ($vstore.filterfunc==filterfunc.bookmark) filteroff();

$: if ($filterbookmarksolid) {
    uncheckall(filterbookmarksolid);
    $vstore.filterfunc=filterfunc.bookmarksolid;
} else if ($vstore.filterfunc==filterfunc.bookmarksolid) filteroff();

$: if ($filterusernote) {
    uncheckall(filterusernote);
    $vstore.filterfunc=filterfunc.usernote;
}  else if ($vstore.filterfunc==filterfunc.usernote) filteroff();

const filterinput=()=>{
    setLocAttrs(addresses,{ltf:linetofind});
    filtertofind.set(true);
    uncheckall(filtertofind,false);
    $vstore.linetofind=linetofind;
}

let linetofind=parsePointer($addresses[0].addr).attrs.ltf;
</script>
<Btn store={filterbookmark} icon="bookmark"/>
<Btn store={filterbookmarksolid} icon="bookmarksolid"/>
<Btn store={filterusernote} icon="usernote"/>
<Btn store={filtertofind} icon="filter"/>
<input class="tofind" bind:value={linetofind} on:input={debounce(filterinput,250)} />
<style>
    .tofind {width:6em;padding-left:5px}
</style>