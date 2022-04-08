<script>
import {getContext} from 'svelte'
import Btn from './comps/button.svelte';
import TocBar from './tocbar.svelte';
import Mulu from './mulu.svelte';
import TocMenu from './tocmenu.svelte';
import TabSelector from './tabselector.svelte';
import {closetab} from './js/addresses';
import {showFrontPage,_,tosim,palitrans} from './js/store.js';
import { parseAddress } from 'pitaka/offtext';
export let ptk
export let scrollStart=0,side=0;
const vstore=getContext('vstore');
const addresses=getContext('addresses');
let lang=ptk.header.lang||DEFAULT_LANGUAGE;
$: mulu = $vstore.mulu || [];
$: y0= $vstore.y0;
$: loc= $vstore.loc;
$: address=($addresses && $addresses[0].address)||'';
</script>
<div class="controlbar">
    {#if side===0}<Btn icon="search" store={showFrontPage} />{/if}
    <TabSelector {side}/>
    <span class="pitaka_tocbartitle">
        <span class="closetab" title="close tab  and open pitaka home" on:click={()=>closetab(addresses)}>
            <div class="inlineblock">{ptk&&parseAddress(address).basket }</div>
            <span title="close tab" >{ptk&&parseAddress(address).loc }</span> 
        </span>
    </span>
    <span class="closetab" on:click={()=>closetab(addresses,true)}>{_(ptk.headingOf(y0).text,$tosim,lang==='pl'&&$palitrans) }</span>


    <TocBar {ptk} {loc} {side}/>
    {#if mulu&&mulu.length}
        <Mulu {ptk} {mulu} {scrollStart} {y0}/>
    {:else if ptk}
        <TocMenu {scrollStart} {ptk}/>
    {/if}
</div>

<style>
    :global(.controlbar){
        user-select: none; 
        width:100%; 
        height:1.5rem;
        background:var(--panel-background)
    }

    .closetab:hover {   text-decoration:line-through; }

</style>