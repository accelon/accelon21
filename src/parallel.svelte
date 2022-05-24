<script>

import {renderer,_,tosim} from './js/store';
import { parseAddress,stringifyAddress } from 'pitaka/offtext';
import {getOppositeAddresses} from './js/addresses';
import { getContext } from 'svelte';
import {get } from 'svelte/store';
import Render from './render_default.svelte'
import Hyperlink from './comps/hyperlink.svelte';
export let loc, ptk, alignptk, side=0 , activeline=false,dy=0;
export let lang=ptk.header.lang;
export let parallels={};
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
$: showing=!!parallels[paraname];
$: [y0] = ptk.getPageRange(loc); 
$: y=y0+dy;
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
    href=createnew?stringifyAddress({basket:ptk.name,loc,dy:opp.dy||dy}):'';
}
$: getParallelHref(side,dy,loc);
const onoff=(bool)=>{
    parallels[paraname]=bool;
    showing=bool;
}
</script>
{#if showing}
{#key y}{#await fetchline()}{fetched++}{/await}{/key}
<Render nesting={1} {activeline}
{ptk} {text} {y} {y0} {loc} lang={ptk.langOf(y)}>
 <span slot="start" class='btnparallel clickable showing'
 title={_(lang,ptk.header.title,$tosim)}
  on:click={()=>onoff(false)} >{getCaption()}</span>
 <Hyperlink {side} {href} title={href}/>
</Render>
{:else} 
<span class='btnparallel clickable' 
title={_(lang,ptk.header.title,$tosim)} on:click={()=>onoff(true)} >{getCaption()}</span>
{/if}