<script>

import {renderer,_,tosim} from './js/store';
import { parseAddress,stringifyAddress } from 'pitaka/offtext';
import {getOppositeAddresses} from './js/addresses';
import { getContext } from 'svelte';
import {get } from 'svelte/store';
import Hyperlink from './comps/hyperlink.svelte';
const vstore=getContext('vstore');
export let loc;
export let ptk;
export let alignptk;
export let side=0;
export let dy=0;
const paraname=ptk.header.name;
const getCaption=()=>{
    const at=paraname.indexOf(alignptk.name+'-');
    let s=paraname;
    if (at==0 && paraname.length>alignptk.name.length) {
        let idx=alignptk.name.length;
        if (paraname[idx]=='-') idx++;
        s=paraname.slice(idx);
    }
    return s;
}

let fetched=0;
let showing=!!$vstore.parallels[paraname];
let [y0] = ptk.getPageRange(loc); 
let y=y0+dy;
let text,href='';
async function fetchline(){
    let unusedy;
    [unusedy,text]=(await ptk.readLines(y,1))[0];
};

const getParallelHref=()=>{
    let createnew=false,opp={};
    const opposite=get(getOppositeAddresses(side));
    if (!opposite.length || typeof opposite[0]!=='string') {
        createnew=true;
    } else {
        opp=parseAddress(opposite[0]);
        if (opp.loc!==loc) createnew=true;
    }
    href=createnew?stringifyAddress({basket:ptk.name,loc,dy:opp.dy||0}):'';
}
getParallelHref();
const onoff=(bool)=>{
    const {parallels}=$vstore;
    parallels[paraname]=bool;
    $vstore.parallels=parallels;
    showing=bool;
}
</script>
{#if showing}
{#await fetchline()}{fetched++}{/await}
<svelte:component nesting={1} this={$renderer.default} 
{ptk} {text} {y} {y0} {loc} lang={ptk.langOf(y)}>
 <span slot="start" class='btnparallel clickable showing'
 title={_(ptk.header.title,$tosim)}
  on:click={()=>onoff(false)} >{getCaption()}</span>
 <Hyperlink {side} {href}/>
</svelte:component>
{:else} 
<span class='btnparallel clickable' 
title={_(ptk.header.title,$tosim)} on:click={()=>onoff(true)} >{getCaption()}</span>
{/if}