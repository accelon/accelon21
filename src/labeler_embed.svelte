<script>
import {fetchHooks} from 'pitaka';
import {renderer} from './js/store.js';
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

export let opening;
export let text='';
export let nesting=0;
let R;
export let ptk,i=0,clss,x,y,starty=0,w=0,name='',attrs={}; //just for hidding the warning
let lines=[];
let color='hsl('+((nesting+3)*60) +' ,50%,30%)';
async function update(attrs){
    if (opening) return;
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
$: if (!opening) update(attrs);

</script>
{#if !opening}
{#if R}<div class="hr" style={"background:"+color }></div>{/if}
<svelte:component nesting={nesting+1} this={R} {lines}/>
{#if R}<div class="hr" style={"background:"+color }></div>{/if}
{/if}

<style>
    div.hr {height:1px}
</style>