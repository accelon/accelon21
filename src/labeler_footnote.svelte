<script>
import {fetchHooks} from 'pitaka';
import {renderer} from './js/store.js';
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
export let opening;
export let text='';
export let nesting=0;
export let starty=0;
let R;
let showing=false;
export let ptk,i=0,clss,x,y,w=0,name='',attrs={}; //just for hidding the warning
let lines=[];
async function update(attrs){
    if (opening) return;

    // if (!attrs || !attrs['@']) {
    //     lines=[];
    //     return;
    // }
    // const hooks=attrs['@'].split(';');
    // lines=await fetchHooks(hooks);
    lines=[{key:1,text:'abc'}]
     R=$renderer._lines;
};

$: if (!opening) update(attrs);
const toggle=()=>{
    showing=!showing
    console.log(showing)
}
</script>
{#if !opening}
<span class='clickable footnote'  on:click={ toggle}>{attrs.n}</span>
{#if showing}
<svelte:component nesting={nesting+1} this={R} {lines}/>
{/if}
{/if}
