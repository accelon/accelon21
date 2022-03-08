<script>

import {fetchHooks} from 'pitaka';
import {markSelection} from './js/selection.js';
import { renderer } from './js/store';

export let starty=0,w=0,side=0,name='',nesting=0; //just for hidding the warning
export let text='',clss='',ptk=null;
export let attrs={},i=0,x,y;
export let opening=false;
$: starty,w,side,name,text,clss,ptk,nesting;
let renderer_backlink=null;
let lines=[];
const toggle=async ()=>{
    if (!renderer_backlink) {
        const hooks=attrs['@'].split(';');
        lines=await fetchHooks(hooks);
        if (lines.length) {
            renderer_backlink=$renderer._lines;
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
<span {i}  {x} {y}><span  target={attrs['@']} x={attrs.x} w={attrs.w}
    on:mouseenter={mouseenter} on:mouseleave={mouseleave} on:click={toggle}
     class:backlink_open={renderer_backlink} class="backlink"> </span>
{#if renderer_backlink}<div class="hr"></div>{/if}
<svelte:component this={renderer_backlink} {lines}/>
{#if renderer_backlink}<div class="hr"></div>{/if}
</span>
{/if}

<style>
    div.hr {border-top:1px solid var(--button-selected)}
    .backlink_open {padding-right:15px;}
    .backlink {font-size:10%;padding-left:8px;border-radius:5px; background:var(--button-unselected);
        cursor:pointer;border-bottom:0px;}
    .backlink:hover {background: Highlight}
</style>