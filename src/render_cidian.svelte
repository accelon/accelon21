<script>
    import {vstates,vlines,tosim,setLoc,cursor,renderer} from './js/store.js';
    import {getTextHook} from './js/selection.js';
import { onMount } from 'svelte';
    export let loc=''
    export let key
    export let idx;
    export let from;
    export let to;
    export let entry='';
    export let ptk=null;
    export let col=0;
    const vstate=vstates[col];
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
            await setLoc(ptk,col,loc);
        } else if (evt.target.tagName=='T') {
            const {hook,y,sel,t,ori}=getTextHook(ptk,evt);
            cursor.set({sel,t,ori});
            vstate.set(Object.assign($vstate,{hook,y,len:sel.length}))
        }
    }
</script>
<div data-key={key} class="entry" on:mouseup={mouseup}>
<div class:wordheadline={idx} on:click={toggleShowEntry}><span class="wordhead">{entry}</span></div>
{#each items as data,idx (idx)}
    <svelte:component col={col} this={$renderer.default} {ptk} {...data}/>
{/each}
</div>

<style>
    .wordheadline{border-top:2px solid var(--button-unselected)}
    .wordhead {padding-left:5px;padding-right:5px;
        border-radius:5px;
        font-size:1.2em;
        cursor:pointer}
    .entry {margin-left:3px;line-height:1.8}
    .loc {cursor:pointer}
    .loc:hover{color:var(--highlight)}
</style>