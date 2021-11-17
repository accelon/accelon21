<script>
import { debounce } from 'pitaka/utils';

import {getContext} from 'svelte';
import { writable } from 'svelte/store';
import Btn from './comps/button.svelte'
 
const viewstore=getContext('viewstore');
const tofindfilter=writable($viewstore.filteron);
const notefilter=writable(false);
const bookmarkfilter=writable(false);
const bookmarksolidfilter=writable(false);
$: $viewstore.filteron=!!$tofindfilter;
const filterinput=()=>{
    $viewstore.linetofind=filterword;
    $tofindfilter=true;
}
let filterword=$viewstore.linetofind||'';
</script>
<Btn  store={bookmarkfilter} icon="bookmark"/>
<Btn store={bookmarksolidfilter} icon="bookmarksolid"/>
<Btn store={notefilter} icon="usernote"/>
<Btn store={tofindfilter} icon="filter"/>
<input class="tofind" bind:value={filterword} on:input={debounce(filterinput,250)} />
<style>
    .tofind {width:6em;padding-left:5px}
</style>