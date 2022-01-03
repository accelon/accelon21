<script>
import {fetchHooks} from 'pitaka';
import {renderer} from './js/store.js';
import { createEventDispatcher } from 'svelte'
import Colorhr from './comps/colorhr.svelte'
const dispatch = createEventDispatcher()

export let opening;
export let text='';
export let nesting=0;
let R;
export let ptk,i=0,clss,x,y,w=0,name='',side=0,attrs={}; //just for hidding the warning
let lines=[];
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

$: if (!opening) update(attrs);

</script>
{#if !opening}
{#if R}<Colorhr {nesting}/>{/if}
<svelte:component nesting={nesting+1} this={R} {lines}/>
{#if R}<Colorhr {nesting}/>{/if}
{/if}
