<script>
import {fetchHooks} from 'pitaka';
import {renderer} from '../js/store.js';
import Colorhr from '../comps/colorhr.svelte'

export let opening,text='';
export let nesting=0,attrs={};
export let closing=0;
export let ptk=null,i=0,clss='',starty=0,x=0,y=0,w=0,name='',side=0; //just for hidding the warning
$: text,ptk,i,clss,x,y,w,name,side,starty,closing;
let lines=[],R;
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
    <span class="wordinfo">{attrs.word} </span>
{/if}

<style>
    .wordinfo {color:maroon ;margin-right: 0.5em}
</style>
