<script>
import { parsePointer } from 'pitaka/offtext';
import { debounce } from 'pitaka/utils';
import {getContext,createEventDispatcher} from 'svelte';
import { writable } from 'svelte/store';
import Btn from './comps/button.svelte'
import {setActiveline, setLocAttrs} from './js/addresses.js'
const vstore=getContext('vstore');
const addresses=getContext('addresses');
const tofindfilter=writable($vstore.filteron);
const notefilter=writable(false);
const bookmarkfilter=writable(false);
const bookmarksolidfilter=writable(false);
$: if ($tofindfilter) {setActiveline(addresses,0); $vstore.scrollToY(0,true);}
$: {$vstore.filteron=!!$tofindfilter ; };

let input;
const filterinput=()=>{
    setLocAttrs(addresses,{ltf:linetofind});
    $tofindfilter=true;
    $vstore.linetofind=linetofind;
}

let linetofind=parsePointer($addresses[0]).attrs.ltf;
</script>
<Btn  store={bookmarkfilter} icon="bookmark"/>
<Btn store={bookmarksolidfilter} icon="bookmarksolid"/>
<Btn store={notefilter} icon="usernote"/>
<Btn store={tofindfilter} icon="filter"/>
<input bind:this={input} class="tofind" bind:value={linetofind} on:input={debounce(filterinput,250)} />
<style>
    .tofind {width:6em;padding-left:5px}
</style>