<script>
import { readLines } from 'pitaka';
import { useBasket } from 'pitaka/basket';
import {dereferencing} from 'pitaka/offtext';
import { renderer } from './js/store';
import Btn from './comps/button.svelte'
import Colorhr from './comps/colorhr.svelte'
export let attrs={},text='',opening=0;
export let name='',w=0,starty=0,ptk=null,i=0,clss='',x=0,y=0,nesting=0; //just for hidding the warning
$: text,name,w,starty;
let tptk,transclusion='';
let showing=null;

const toggle=async ()=>{
    if (!showing) {
        const hook=attrs['@'];
        const ptr=await dereferencing(hook,ptk);
        if (ptr.length) {
            const {h,ptk}=ptr[0];
            const lines=await readLines({basket:ptk.name,nline:h.y,count:1});
            tptk=useBasket(ptk.name);
            transclusion={ text:lines[0][1] , 
                //q:text, hook:h, 
                ptk:tptk, y:lines[0][0] , key:'tc'+Math.random() } ;       
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
<Colorhr {nesting}/>
<svelte:component this={showing} {...transclusion}/>
<Colorhr {nesting}/>
{/if}
</span>
{/if}
<style>
    .showing {padding-right:20px;border-radius:10px}
    .transclusion {cursor:pointer;border-bottom:0px;padding-left:5px;
        background:var(--button-unselected)}
    .transclusion:hover {background: var(--highlight)}
</style>