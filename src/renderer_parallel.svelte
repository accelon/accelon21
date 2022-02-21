<script>

import {renderer} from './js/store';
import { parseAddress } from 'pitaka/offtext';
import {newopposite,getOppositeAddresses} from './js/addresses';
import { getContext } from 'svelte';
import { get } from 'svelte/store';
import Hyperlink from './comps/hyperlink.svelte';
const vstore=getContext('vstore');
export let loc;
export let dy=0;
export let ptk;
export let side=0;
export let par;
export let caption;
let showing=!!$vstore.parallels[par];
let [y0] = ptk.getPageRange(loc);

let text,y,href='';
async function fetchline(){
    [y,text]=(await ptk.readLines(y0+dy,1))[0];
};

const getParallelHref=()=>{
    let createnew=false;
    const opposite=get(getOppositeAddresses(side));
    if (!opposite.length || typeof opposite[0]!=='string') {
        createnew=true;
    } else {
        const opp=parseAddress(opposite[0]);
        if (opp.loc!==loc) createnew=true;
    }
    href=createnew?ptk.name+'/'+loc:'';
}
getParallelHref();
const onoff=(bool)=>{
    const {parallels}=$vstore;
    parallels[par]=bool;
    $vstore.parallels=parallels;
    showing=bool;
}
</script>
{#if showing}
{#await fetchline()} {/await}
<svelte:component nesting={1} this={$renderer.default} {ptk} {text} {y} {y0} {loc} lang={ptk.langOf(y)}>
 <span slot="start" class='btnparallel clickable showing' on:click={()=>onoff(false)} >{caption}</span>
 <Hyperlink {side} {href}/>
</svelte:component>
{:else} 
<span class='btnparallel clickable' on:click={()=>onoff(true)} >{caption}</span>
{/if}