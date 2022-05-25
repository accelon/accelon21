<script>
import { readLines } from 'pitaka';
import { useBasket } from 'pitaka/basket';
import {dereferencing,stringifyAddress} from 'pitaka/offtext';
import { renderer } from '../js/store';

import Hyperlink from '../comps/hyperlink.svelte';
import Colorhr from '../comps/colorhr.svelte'
export let attrs={},text='',opening=0,closing=0;
export let name='',w=0,starty=0,ptk=null,i=0,clss='',side=0,x=0,y=0,nesting=0; //just for hidding the warning
$: text,name,w,starty,closing;
let tptk,transclusion='';
let showing=null;
let href='',title='',heading='';
let notfound=false;
const toggle=async ()=>{
    if (!showing) {
        const addr=attrs['@'];
        const ptr=await dereferencing(addr,ptk);
        const hobj=ptk.headingOf(addr);
        if (ptr.length) {
            const {h,ptk}=ptr[0];
            if (!h.y) {
                notfound=true;
                return;
            }
            const lines=await readLines({basket:ptk.name,nline:h.y,count:1});
            tptk=useBasket(ptk.name);
            transclusion={ text:lines[0][1] , ptk:tptk, y:lines[0][0] , key:'tc'+Math.random()  };
            
            showing=$renderer.default;
            title=addr;
            if (hobj.idx) heading=hobj.rawtext; //顯示標題
            console.log(heading)
            href=ptk.locOf(h.y);
        }
    } else {
        showing=null;
    }
    
}
</script>
{#if !opening}
<span {i} class:notfound class={clss} {x} {y}><span class:showing class="transclusion"  on:click={toggle}> </span>
{#if showing} <Hyperlink {side} {title} {href}/>
<Colorhr {nesting}/>
<svelte:component nesting={nesting+1} this={$renderer.default}  lang={ptk.langOf(y)} text={heading} {ptk} {side}></svelte:component>
<svelte:component nesting={nesting+1} this={showing} {...transclusion}/>
<Colorhr {nesting}/>
{/if}
</span>
{/if}
<style>
    .notfound {background:red}
    .showing {padding-right:20px;border-radius:10px}
    .transclusion {cursor:pointer;border-bottom:0px;padding-left:5px;
        background:var(--button-unselected)}
    .transclusion:hover {background: var(--highlight)}
</style>