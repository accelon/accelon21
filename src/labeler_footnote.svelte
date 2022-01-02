<script>
import { PATHSEP} from 'pitaka';

import { parseAddress, stringifyAddress } from 'pitaka/offtext';

import {renderer} from './js/store.js';
export let opening;
export let text='';
export let nesting=0;
export let starty=0;
const R=$renderer._lines;
let showing=false;
export let ptk,i=0,clss,x,y,w=0,name='',attrs={}; //just for hidding the warning
let lines=[];
async function update(attrs){
    if (opening) return;
    lines=await ptk.fetchFootnote(starty, attrs.n); 
};

$: if (!opening && showing) update(attrs);
const toggle=()=>{
    showing=!showing
}
</script>
{#if !opening}
<span class='clickable footnote'  on:click={ toggle}>{attrs.n}</span>
{#if showing}
<svelte:component nesting={nesting+1} this={R} {lines}/>
{/if}
{/if}
