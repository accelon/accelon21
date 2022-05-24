<script>
import {useBasket} from 'pitaka'
import {parseAddress,stringifyAddress } from 'pitaka/offtext';
import {_,tosim, renderer,palitrans} from './js/store.js';
import { settab ,getOppositeAddresses} from './js/addresses';
import Parallel from './parallel.svelte'
import HyperLink from './comps/hyperlink.svelte'
export let y=0,loading=false, activeline=false;
export let score=0,ncl=0,ptk,side=0,hits=[],chunk=0,idx=0;
export let lang=ptk.header.lang||DEFAULT_LANGUAGE;
export let parallels={};

$: langstyle='lang-'+lang+(lang==='pl'?'-'+($palitrans||''):'')
$: score,ncl,ptk,chunk;
$: alignedPtk=ptk.aligned.map(it=>useBasket(it)).filter(it=>!!it);
$: dy = ptk.dyOf(y);
$: loc = ptk.locOf(y,true,true); //no pitaka name, no dy
const newtab=e=>{
    const loc=ptk.locOf(y);
    const ptr=parseAddress(loc);
    const addr=getAddress(y)
    settab(side,addr,{newtab:true});
}
const getAddress=y=>{
    const loc=ptk.locOf(y);
    const ptr=parseAddress(loc);
    const addr=stringifyAddress(ptr);
    return addr;    
}
</script>
<div class={'excerptlinetext '+langstyle} class:activeline>
<span class='excerptheader'>{idx+1}.
    <span class='bookid'>{ptk.chunkOf(y).id}</span> 
    <span class="clickable" on:click={e=>newtab(e)}>
    {_(lang,ptk.headingOf(y).text,$tosim,$palitrans) }</span><HyperLink href={getAddress(y)} />
</span>
{#if !loading}<svelte:component this={$renderer.default} 
setactiveline={false} {y} {ptk} {hits} loc={ptk.locOf(y)}
 >
{#each alignedPtk as aptk} <Parallel ptk={aptk} bind:parallels alignptk={ptk} {loc} {dy}/> {/each}
</svelte:component>

 {/if}
</div>