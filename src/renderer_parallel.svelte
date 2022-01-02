<script>

import {renderer} from './js/store';
import { parseAddress } from 'pitaka/offtext';
import {newopposite,getOppositeAddresses} from './js/addresses';
import { getContext } from 'svelte';
import { get } from 'svelte/store';

const vstore=getContext('vstore');
export let loc;
export let ptk;
export let side=0;
export let par;
export let caption;
let showing=!!$vstore.parallels[par];
let [y0] = ptk.getPageRange( ptk.pageLoc(loc));
const dy=ptk.dyOf(loc);
let text,y;
async function fetchline(){
    [y,text]=(await ptk.readLines(y0+dy,1))[0];
};

const openParallel=()=>{
    let createnew=false;
    const opposite=get(getOppositeAddresses(side));
    if (!opposite.length || typeof opposite[0]!=='string') {
        createnew=true;
    } else {
        const opp=parseAddress(opposite[0]);
        if (opp.loc!==loc) createnew=true;
    }
    if (createnew) newopposite(side,ptk.name+'/'+loc);
}
const onoff=(bool)=>{
    const {parallels}=$vstore;
    parallels[par]=bool;
    $vstore.parallels=parallels;
    showing=bool;
}
</script>
{#if showing}
{#await fetchline()} {/await}
<svelte:component nesting={1} this={$renderer.default} {ptk} {text} y={y0+dy} {y0} {loc} lang={ptk.langOf(y0+dy)}>
 <span slot="start" class='btnparallel clickable showing' on:click={()=>onoff(false)} >{caption}</span>
 <span class='clickable' on:click={openParallel}>⭆</span>
</svelte:component>

{:else} 
<span class='btnparallel clickable' on:click={()=>onoff(true)} >{caption}</span>
{/if}