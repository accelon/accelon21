<script>
import { onMount } from 'svelte';
import { get } from 'svelte/store';

import Icons from './icons.js';
export let onclick=null;
export let disabled=false;
export let title='';
export let forceupdate='';
export let states={};
export let storeid=null;
export let styles=null;
export let caption='';
const statekeys=Object.keys(states);
let keyindex=statekeys.indexOf($storeid);
if (keyindex==-1) {
    keyindex=0;
    $storeid=statekeys[keyindex];
}
const setcaption=()=>{
    if (storeid) caption=states[ $storeid]
    caption=Icons[caption]||caption;
}
const highlight=str=>{
    if (!styles) return str;
    return str.replace(/\$(\w+)/g,(m,m1)=>{
        if (typeof styles[m1]=='string') {
            return styles[m1];
        }else if (typeof styles=='function') {
            return styles(m1);
        } else {
            return get(styles[m1])||'auto';
        }
    })
}

const click=evt=>{
    if(disabled)return;
    if (storeid) {
        keyindex ++;
        if (keyindex>= statekeys.length) keyindex=0;
        $storeid=statekeys[keyindex];
    }
    onclick&&onclick(evt);
    setcaption();
}
onMount(()=>setcaption());
</script>
<span class="button" class:disabled title={title} on:click={click} >
    <span>{@html highlight(caption,forceupdate)}</span>
</span>

<style>
    .button{ vertical-align: top;cursor:pointer;fill:var(--button-selected);padding-right:0.2em}
    .button.disabled {cursor:auto;fill:none;stroke:var(--button-unselected) }
    .button.disabled:hover {fill:none; stroke: var(--button-unselected)}
    .button:hover {color:var(--hover); fill:var(--hover);stroke:var(--hover);}
</style>