<script>
import {writable} from 'svelte/store'
import {useBasket} from 'pitaka';
import { debounce } from 'pitaka/utils';
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import ExcerptBar from './excerptbar.svelte'
import HeadingCount from './comps/headingcount.svelte'
import HeadingMenu from './headingmenu.svelte'
import HeadingList from './headinglist.svelte'
import ExcerptList from './excerptlist.svelte'
import {parseAddress,stringifyAddress } from 'pitaka/offtext';
import {buildHeadingList} from './js/heading.js';
import {searchbox,tosim} from './js/store.js';
import {queryhistory,QUERYSEP} from './js/query.js'
import {setAddress} from './js/addresses.js'
import { setContext } from 'svelte';
export let side=0,address='',active=false;
export let visible=false;
const headingitems=writable([]);
const excerptitems=writable([]);
$: visible;
const bkstore=writable({aligned:[]});
setContext('bkstore',bkstore);

let ptk;
let showheading=true;
let addr={},refreshcount=0;
let keyvalue='',keylabel='', tofind='',scoredLine=[];

const refreshquery=async (_addr)=>{
    if (!_addr.basket) {
        _addr.basket=_addr.loc;
        _addr.loc='';
    }
    let firsttime=false;
    if (!ptk) { //first refresh
        showheading=!_addr.tf;
        firsttime=true;
    }
    ptk=useBasket(_addr.basket);
    let scored=false;
    if (addr.tf!==_addr.tf) {
        if (_addr.tf) {
            const res=await ptk.fulltextSearch(_addr.tf,{excerpt:true,tosim:$tosim});
            scoredLine=res.scoredLine;
            scored=true;
            tofind=_addr.tf;
        } else scoredLine=[];
    } 
    if (_addr.kv!==addr.kv || _addr.kl!==addr.kl || scored ||firsttime) {
        buildHeadingList(_addr,scoredLine,headingitems,excerptitems);

        keylabel=_addr.kl;
        keyvalue=_addr.kv;
        filterheadings={};
    }
    addr=_addr;
    refreshcount++;
}
const onKeyword=(kl,kv)=>{
    const newaddr={...addr, kl,kv}
    const address=stringifyAddress(newaddr);
    setAddress(side,address);
}
let scrollStart=0;
const onScroll=topline=>{
    scrollStart=topline;
}
const onTofind=()=>{
    if (refreshcount<1) return;  //workaround for init update
    const newaddr={...addr, tf:tofind}
    const address=stringifyAddress(newaddr);
    active&&setAddress(side,address);
}
const filterBy=(excerpts)=>{
    if (Object.keys(filterheadings).length==0) return excerpts;

    return excerpts.filter(it=> filterheadings[it.ncl]);
}
let filterheadings={};
let filterExcerptitems=[];
$: refreshquery(parseAddress(address));
$: qhis=$queryhistory.split(QUERYSEP);
$: filterExcerptitems = filterBy($excerptitems, filterheadings ); 

</script>

<div class="container">
{#if ptk}
    <ExcerptBar {showheading} {side} {ptk} excerpts={$excerptitems} bind:filterheadings>
    <HeadingCount count={$headingitems.length} bind:showheading/>
    
    <span class:displaynone={!showheading}>
    <svelte:component {onKeyword} this={$searchbox[ptk.format]||$searchbox.toc} {ptk} bind:keyvalue bind:keylabel/>
    </span>
    
    <span class:displaynone={showheading} >
    <AutoComplete className="tofind" showClear={true} bind:text={tofind} items={qhis}  onInput={debounce(onTofind,250)} onChange={onTofind}/>
    </span>
    {#if showheading}
    <HeadingMenu {scrollStart} {ptk}/>
    {/if}

    </ExcerptBar>

    {#if showheading}
    <HeadingList {ptk} {side} items={headingitems} {onKeyword} {onScroll}/>
    {:else}
    <ExcerptList {ptk} {side} items={filterExcerptitems} {onScroll}/>
    {/if}
{/if}
</div>
<style>
    :global(.tofind) {width:15em}
</style>