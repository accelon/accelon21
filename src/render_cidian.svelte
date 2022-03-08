<script>
import {tosim,cursor,renderer} from './js/store.js';
import {setLoc} from './js/addresses.js'
import {getTextHook} from './js/selection.js';
import { getContext, onMount } from 'svelte';
export let loc='', key=0, nth=0,idx=''
export let from='',to=''
export let attrs=[], text='' ,entry='',ptk=null;
const viewstore=getContext('viewstore');
$: nth,text;
export let show=false;
let items=[];
onMount(async ()=>{
    if (show) toggleShowEntry(show);
})
const toggleShowEntry=async(evt)=>{
    if (evt.target) show=!show;
    items.length=0;
    if (show) {
        await ptk.prefetchLines(from,to);
        for (let key=from+1;key<to;key++) {
            items.push({key})
        }
    }
    items=items;
}
const mouseup=async evt=>{
    if (evt.button!==0) return;
    if (loc) {
        await setLoc({ptk,loc},viewstore);
    } else if (evt.target.tagName=='T') {
        const {hook,y,sel,t,ori}=getTextHook(ptk,evt);
        if (!sel)return;
        cursor.set({sel,t,ori});
        // vstate.set(Object.assign($vstate,{hook,y,len:sel.length}))
    }
}
</script>
<div data-key={key} class="entry" on:mouseup={mouseup}>
<div class:entryline={idx} on:click={toggleShowEntry}>
{#if !show}{#each attrs as attr}
<span class={"entry-"+attr[0]}>{attr[1]}</span>
{/each}{/if}
<span class="entry">{entry}</span>
</div>
{#each items as data,idx (idx)}
    <svelte:component this={$renderer.default} {ptk} {...data}/>
{/each}
</div>

<style>
    .simplified {color:goldenrod}
    .entryline{border-top:2px solid var(--button-unselected)}
    .entry {padding-left:5px;padding-right:5px;
        border-radius:5px;
        font-size:1.2em;
        cursor:pointer}
    .entry {margin-left:3px;line-height:1.8}
    .loc {cursor:pointer}
    .loc:hover{color:var(--highlight)}
    .xx{font-family: Georgia, 'Times New Roman', Times, serif;}
</style>