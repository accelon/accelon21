<script>
import {fetchHooks} from 'pitaka';
import {renderer} from './js/store.js';
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

export let opening;
export let nesting=0;
let R;
export let ptk,i=0,clss,x,y,starty=0,w=0,name='',attrs={}; //just for hidding the warning
let lines=[];
let color='hsl('+((nesting+3)*60) +' ,50%,30%)';
async function update(attrs){

    if (!attrs || !attrs['@']) {
        lines=[];
        return;
    }
    const hooks=attrs['@'].split(';');
    lines=await fetchHooks(hooks);
    if (lines.length) R=$renderer._lines;
};
const closeme=()=>{
    dispatch('close')
}
$: update(attrs);

</script>
{#if !opening}
<span class='closebutton' on:click={closeme}> </span>
{#if R}<div class="hr" style={"background:"+color }></div>{/if}
<svelte:component nesting={nesting+1} this={R} {lines}/>
{#if R}<div class="hr" style={"background:"+color }></div>{/if}
{/if}

<style>
    div.hr {height:1px;}
    .closebutton{font-size:10%;border-radius:5px; padding-left:15px;cursor:pointer;border-radius: 10px;
    background:Highlight}
</style>