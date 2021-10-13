<script>
export let opening=false;
import {markSelection} from './js/selection.js';
export let ptk,i=0,clss,x,y,starty=0,w=0,name='',attrs={}; //just for hidding the warning
import { renderer } from './js/store';
let renderer_backlink=null;
let backlink;
const toggle=async ()=>{
    if (!renderer_backlink) {
        const hook=attrs['@'];
        const ptr=await dereferencing(hook);
        if (ptr.length) {
            const {h,ptk}=ptr[0];
            const lines=await readLines({basket:ptk,nline:h.y,count:1});
            tptk=useBasket(ptk);
            backlink={ text:lines[0][1] , hook:h, 
                q:text, ptk:tptk, y:lines[0][0] , key:'bl'+Math.random() } ;       
                renderer_backlink=$renderer.default;     
        }
    } else {
        renderer_backlink=null;
    }
}
const mouseenter=evt=>{
    const x=parseInt(evt.target.attributes.x.value);
    const w=parseInt(evt.target.attributes.w.value);
    markSelection(evt.target,x,w);
}
const mouseleave=()=>{
    // console.log(x,w)
}
</script>


{#if opening}
<span {i} class={clss} {x} {y}><span class="backlink" target={attrs['@']} x={attrs.x} w={attrs.w}
    on:mouseenter={mouseenter} on:mouseleave={mouseleave} on:click={toggle}>{opening?'◎':'●'}</span>
<svelte:component this={renderer_backlink} {...backlink}/>
</span>
{/if}

<style>
    .backlink {cursor:pointer;border-bottom:0px;color:green}
    .backlink:hover {color: var(--highlight)}
</style>