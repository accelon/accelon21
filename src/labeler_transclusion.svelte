<script>
import { readLines } from 'pitaka';
import { useBasket } from 'pitaka/basket';
import {dereferencing} from 'pitaka/offtext';
import { renderer } from './js/store';
import Btn from './comps/button.svelte'
export let attrs={}
export let text='';
export let opening=false;
export let name='',w=0,ptk=null,i=0,clss,x,y,starty=0,nesting=0; //just for hidding the warning
let color='hsl('+((nesting+3)*60) +' ,50%,30%)';
let tptk,transclusion='';
let showing=null;

const toggle=async ()=>{
    if (!showing) {
        const hook=attrs['@'];
        const ptr=await dereferencing(hook);
        if (ptr.length) {
            const {h,ptk}=ptr[0];
            const lines=await readLines({basket:ptk,nline:h.y,count:1});
            tptk=useBasket(ptk);
            transclusion={ text:lines[0][1] , hook:h, 
                q:text, ptk:tptk, y:lines[0][0] , key:'tc'+Math.random() } ;       
                showing=$renderer.default;     
        }
    } else {
        showing=null;
    }
}
</script>
{#if !opening}
<span {i} class={clss} {x} {y}><span class:showing class="transclusion" on:click={toggle}> </span>
{#if showing}<Btn icon='read' title={JSON.stringify(transclusion.hook)}/>
<div class="hr" style={"background:"+color }></div>
<svelte:component this={showing} {...transclusion}/>
<div class="hr" style={"background:"+color }></div>
{/if}
</span>
{/if}
<style>
    div.hr {height:1px}
    .showing {padding-right:20px;border-radius:10px}
    .transclusion {cursor:pointer;border-bottom:0px;padding-left:5px;
        background:var(--button-unselected)}
    .transclusion:hover {background: var(--highlight)}
</style>