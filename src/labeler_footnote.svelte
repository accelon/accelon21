<script>
import {renderer} from './js/store.js';
export let opening;
export let text='';
export let nesting=0;
export let starty=0;
const R=$renderer._lines;
let showing=false;
import Colorhr from './comps/colorhr.svelte'
export let ptk,i=0,clss,x,y,w=0,name='',side=0,attrs={}; //just for hidding the warning
let color='hsl('+((nesting+3)*60) +' ,50%,30%)';
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
<Colorhr {nesting}/>
<svelte:component nesting={nesting+1} this={R} {lines} {ptk}/>
<Colorhr {nesting}/>
{/if}
{/if}
