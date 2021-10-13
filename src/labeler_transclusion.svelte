<script>
import { readLines } from 'pitaka';
import { useBasket } from 'pitaka/basket';
import {dereferencing} from 'pitaka/offtext';
import { renderer } from './js/store';
export let attrs={}
export let text='';
export let opening=false;
export let ptk,i,clss,x,y,starty=0; //just for hidding the warning

let tptk,transclusion='';
let renderer_transclusion=null;

const toggle=async ()=>{
    if (!renderer_transclusion) {
        const hook=attrs['@'];
        const ptr=await dereferencing(hook);
        if (ptr.length) {
            const {h,ptk}=ptr[0];
            const lines=await readLines({basket:ptk,nline:h.y,count:1});
            tptk=useBasket(ptk);
            transclusion={ text:lines[0][1] , hook:h, 
                q:text, ptk:tptk, y:lines[0][0] , key:'tc'+Math.random() } ;       
            renderer_transclusion=$renderer.default;     
        }
    } else {
        renderer_transclusion=null;
    }
}
</script>
{#if !opening}
<span {i} class={clss} {x} {y}><span class="transclusion" on:click={toggle}>●</span>
<svelte:component this={renderer_transclusion} {...transclusion}/>
</span>
{/if}
<style>
    .transclusion {cursor:pointer;border-bottom:0px}
    .transclusion:hover {color: var(--highlight)}
</style>