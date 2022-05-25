<script>
import {renderer} from '../js/store.js';
export let opening;
export let closing=false,text='';
export let nesting=0;
export let starty=0;
$: closing,text;
const R=$renderer._lines;
let showing=false;
import Colorhr from '../comps/colorhr.svelte'
export let ptk=null,i=0,clss='',x=0,y=0,w=0,name='',side=0,attrs={}; //just for hidding the warning
$: i,clss,x,y,w,name,side;
let color='hsl('+((nesting+3)*60) +' ,50%,30%)';
let lines=[];
async function update(attrs){
    if (opening) return;
    let y=starty; //footnote in this chunk
    if (attrs.val) {        
        lines=attrs.val.split('\n').map( (text,key)=> {return {key,text }} ); //convert to scrollview format
        return;
    }
    const addr=attrs['@'];
    if (addr) { //other chunk
        [y]=ptk.getPageRange(addr);
    }
    if (y) lines=await ptk.fetchFootnote(y, attrs.id); 
};

$: if (!opening && showing) update(attrs);
const toggle=()=>{
    showing=!showing
}
</script>
{#if !opening}
<span class='clickable footmark' on:click={ toggle}>{attrs.id}</span>
{#if showing}
<Colorhr {nesting}/>
<svelte:component nesting={nesting+1} this={R} {lines} {ptk}/>
<Colorhr {nesting}/>
{/if}
{/if}
