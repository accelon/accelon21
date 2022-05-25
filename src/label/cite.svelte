<script>
import { readLines } from 'pitaka';
import { useBasket } from 'pitaka/basket';
import {dereferencing,makeAddress} from 'pitaka/offtext';
import { renderer } from '../js/store';
import Hyperlink from '../comps/hyperlink.svelte';
import Colorhr from '../comps/colorhr.svelte'
export let attrs={},text='',opening=0,closing=0;
export let name='',w=0,starty=0,ptk=null,i=0,clss='',side=0,x=0,y=0,nesting=0; //just for hidding the warning
$: text,name,w,starty,closing;
let cite_y=0,fetched=false,cite_ptk=null,href='';
let notfound=false;
$: clss,x,i,opening,ptk;
const fetchline=async ()=>{
        const addr=attrs['@'];
        const lang=ptk.langOf(y);
        cite_ptk=useBasket(name+'-'+lang);
        if (!cite_ptk) cite_ptk=useBasket(name);
        
        if (!cite_ptk) return;
        const ptr=await dereferencing(addr,cite_ptk);
        const hobj=cite_ptk.headingOf(addr);
        if (ptr.length) {
            const {h}=ptr[0];
            if (!h.y) {
                notfound=true;
                return;
            }
            const lines=await readLines({basket:cite_ptk.name,nline:h.y,count:1});
            cite_y=h.y;
            href=makeAddress(cite_ptk.name,addr);
        }    
}
</script>
{#await fetchline()}{fetched=true}{/await}
{#if fetched && !opening}
<Colorhr {nesting}/>
<svelte:component nesting={nesting+1} this={$renderer.default} 
 lang={cite_ptk.langOf(y)} y={cite_y} ptk={cite_ptk} {side}>
 <Hyperlink {side} {href}/>
</svelte:component>
<Colorhr {nesting}/>
{/if}

<style>

</style>