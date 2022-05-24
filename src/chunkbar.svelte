<script>
import {getContext} from 'svelte'
import Btn from './comps/button.svelte';
import TocBar from './tocbar.svelte';
import Mulu from './mulu.svelte';
import TocMenu from './tocmenu.svelte';
import TabSelector from './tabselector.svelte';
import {getLangstyle} from './js/decorate.js'
import {closetab} from './js/addresses';
import {showFrontPage,_,tosim,palitrans,factorization} from './js/store.js';
import { parseAddress } from 'pitaka/offtext';
export let ptk,scrollStart=0,side=0,y0,loc,mulu=[],scrollToY=()=>{};
const addresses=getContext('addresses');
let lang=ptk.header.lang;
$: langstyle=getLangstyle(lang,$palitrans);

$: address=($addresses && $addresses[0].address)||'';
</script>
<div class="controlbar">
    {#if side===0}<Btn icon="search" store={showFrontPage} />{/if}
    <TabSelector {side}/>
    <span class="pitaka_tocbartitle">
        <span class="closetab" title={_(lang,"關閉並回到文章列表 close tab and list article",$tosim)} on:click={()=>closetab(addresses)}>
            <div class="inlineblock">{ptk&&parseAddress(address).basket }</div>
            <span>{ptk&&parseAddress(address).loc }</span> 
        </span>
    </span>
    <span class={"closetab "+langstyle} title={_(lang,"關閉頁籤 close tab",$tosim)} on:click={()=>closetab(addresses,true)}>{_(lang,ptk.headingOf(y0).text,$tosim,lang==='pl'&&$palitrans,20) }</span>

    <TocBar {ptk} {loc} {side}/>
    {#if mulu&&mulu.length}
        <Mulu {ptk} {mulu} {scrollStart} {scrollToY} {y0}/>
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