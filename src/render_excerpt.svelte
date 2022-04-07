<script>
import {parseAddress,stringifyAddress } from 'pitaka/offtext';
import {_,tosim, renderer,palitrans} from './js/store.js';
import { settab ,getOppositeAddresses} from './js/addresses';
export let key=0,y=0,loading=false;
export let score=0,ncl=0,ptk,side=0,hits=[];
export let lang=ptk.header.lang||DEFAULT_LANGUAGE;
$: score,ncl,ptk;

const newtab=()=>{
    const loc=ptk.locOf(y);
    const ptr=parseAddress(loc);
    const addr=stringifyAddress(ptr);
    settab(getOppositeAddresses(side),addr)
}
</script>
<div>
<span class='excerptheader'>{key+1}.
    <span class='bookid'>{ptk.chunkOf(y).id}</span> 
    <span class="clickable" on:click={()=>newtab()}>{_(ptk.headingOf(y).text,$tosim,lang==='pl'&&$palitrans) } </span>
</span>
{#if !loading}<svelte:component this={$renderer.default} 
setactiveline={false} {y} {ptk} {hits} loc={ptk.locOf(y)}
 />{/if}
</div>