<script>
import { onMount } from 'svelte';
import { get } from 'svelte/store';

import Icons from './icons.js';
export let onclick=null;
export let disabled=false;
export let title='';
export let states={};

export let storeid=null;
export let styles=null;
export let caption='';
const statekeys=Object.keys(states);
export let selectedIndex=(storeid && statekeys.indexOf( get(storeid).toString() ))||-1;
if (selectedIndex==-1) {//invalid value
    selectedIndex=0;    //force to first value
    if (storeid && get(storeid).toString()!==statekeys[selectedIndex]) storeid.set(statekeys[selectedIndex]);
}

const setcaption=()=>{
    if (storeid) caption=states[ get(storeid)]
    caption=Icons[caption]||caption;
}
const highlight=(str,selectedIndex)=>{
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
    selectedIndex ++;
    if (selectedIndex>= statekeys.length) selectedIndex=0;
    if (storeid) storeid.set(statekeys[selectedIndex]);

    onclick&&onclick(evt);
}
$: setcaption(selectedIndex);
onMount(()=>setcaption());
</script>
<span class="button" class:disabled {title} on:click={click} >
    <span>{@html highlight(caption,selectedIndex)}</span>
</span>

<style>
    .button{ vertical-align: top;cursor:pointer;fill:var(--button-selected);padding-right:0.2em}
    .button.disabled {cursor:auto;fill:none;stroke:var(--button-unselected) }
    .button.disabled:hover {fill:none; stroke: var(--button-unselected)}
    .button:hover {color:var(--hover); fill:var(--hover);stroke:var(--hover);}
</style>