<script>
import {useBasket} from 'pitaka'
import {parseAddress,stringifyAddress } from 'pitaka/offtext';
import {_,tosim, renderer,palitrans} from './js/store.js';
import { settab ,getOppositeAddresses} from './js/addresses';
import Parallel from './renderer_parallel.svelte'

export let key=0,y=0,loading=false;
export let score=0,ncl=0,ptk,side=0,hits=[];
export let lang=ptk.header.lang||DEFAULT_LANGUAGE;
$: score,ncl,ptk;
$: alignedPtk=ptk.aligned.map(it=>useBasket(it)).filter(it=>!!it);
$: dy = ptk.dyOf(y);
$: loc = ptk.locOf(y,true,true); //no pitaka name, no dy
const newtab=e=>{
    const loc=ptk.locOf(y);
    const ptr=parseAddress(loc);
    const addr=stringifyAddress(ptr);
    if (e.ctrlKey) {
        settab(side,addr,{newtab:true});
    } else {
        settab(getOppositeAddresses(side),addr)
    }
}
</script>
<div>
<span class='excerptheader'>{key+1}.
    <span class='bookid'>{ptk.chunkOf(y).id}</span> 
    <span class="clickable" on:click={e=>newtab(e)}>{_(ptk.headingOf(y).text,$tosim,lang==='pl'&&$palitrans) } </span>
</span>
{#if !loading}<svelte:component this={$renderer.default} 
setactiveline={false} {y} {ptk} {hits} loc={ptk.locOf(y)}
 >
{#each alignedPtk as aptk} <Parallel ptk={aptk} alignptk={ptk} {loc} {dy}/> {/each}
</svelte:component>

 {/if}
</div>