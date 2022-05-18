<script>
// a search viewer has a main pitaka, but a pitaka might have multiple session
import {writable,derived,get} from 'svelte/store'
import {useBasket} from 'pitaka';
import {debounce} from 'pitaka/utils';
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import ExcerptBar from './excerptbar.svelte'
import HeadingCount from './comps/headingcount.svelte'
import HeadingMenu from './headingmenu.svelte'
import HeadingList from './headinglist.svelte'
import ExcerptList from './excerptlist.svelte'
import {parseAddress,stringifyAddress } from 'pitaka/offtext';
import {buildHeadingList} from './js/heading.js';
import {searchbox,tosim, _} from './js/store.js';
import {queryhistory,QUERYSEP,addqueryhistory} from './js/query.js'
import {setAddress} from './js/addresses.js'
import { setContext } from 'svelte';
import {toSim} from 'lossless-simplified-chinese'
export let side=0,address='',active=false;
export let visible=false;
let ptk;

export const headings=writable([]);  
export const filterings=writable([]);
export const excerptitems=writable([]);
export const filtersOptions=writable({});
export const filtersResult=writable([]);

setContext('headings',headings); 
setContext('filtersOptions',filtersOptions);
setContext('filtersResult',filtersResult);
setContext('filterings',filterings);
setContext('excerptitems',excerptitems);

const bkstore=writable({aligned:[]});
setContext('bkstore',bkstore);
setContext('headings',headings);
setContext('excepts',excerptitems);

$: visible;

let showheading=true;
let addr={},refreshcount=0;
let tofind='',scoredLine=[], posting=[];
let booksOfItems=[];
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
    if (addr.tf!==_addr.tf || $filtersResult.length) {
        if (_addr.tf) {
            const ranges=ptk.getHeadingRanges($filtersResult);
            const res=await ptk.fulltextSearch(_addr.tf,{excerpt:true,tosim:$tosim,ranges});
            scoredLine=res.scoredLine;
            posting=res.posting;
            scored=true;
            tofind=_addr.tf;
        } else scoredLine=[];
    } 
    if (_addr.kv!==addr.kv || _addr.kl!==addr.kl || scored ||firsttime) {
        booksOfItems=buildHeadingList(_addr,scoredLine,excerptitems);
        // keylabel=_addr.kl;
        // keyvalue=_addr.kv;
        selectedheadings={};
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
    if (tofind&&showheading)showheading=false;
}
const filterExcerptByHeading=(excerpts,selectedheadings)=>{
    if (Object.keys(selectedheadings).length==0) return excerpts;
    return excerpts.filter(it=> selectedheadings[it.ncl]);
}

const itemFilterFunction=(item,searchwords)=>{
    item=toSim(item,2);
    const sw=searchwords.map(s=>toSim(s,2));
    for (let i=0;i<sw.length;i++) {
        if (item.slice(0,sw[i].length)===sw[i]) return true;
    }
}
let selectedheadings={};     //搜尋後的選擇
let selectedExcerptitems=[];

$: refreshquery(parseAddress(address),$filtersResult);
$: qhis=tofind.length?ptk.prefixLemma(tofind) : queryhistory(lang);
$: lang=ptk.header.lang;
$: selectedExcerptitems = filterExcerptByHeading($excerptitems, selectedheadings); 
$: addable = tofind.length>1 && queryhistory(lang).indexOf(tofind.trim())==-1 && $excerptitems.length;

</script>

<div class="container">
{#if ptk}
    <ExcerptBar {showheading} {side} {ptk} excerpts={$excerptitems} bind:selectedheadings>
    <HeadingCount count={$filtersResult.length} bind:showheading/>
    
    <!-- <span class:displaynone={!showheading}>
    <svelte:component {onKeyword} this={$searchbox[ptk.format]||$searchbox.toc} {ptk} bind:keyvalue bind:keylabel/>
    </span> -->


    <AutoComplete className="tofind" showClear={true} 
    placeholder={_("檢索 Search")} {itemFilterFunction}
    bind:text={tofind} items={qhis}  onInput={debounce(onTofind,250)} onChange={onTofind}/>
    {#if addable}<span title={_("加到搜尋記錄 add to history")} on:click={()=>addqueryhistory(tofind,lang)}>☆</span>{/if}

    {#if showheading}
    <HeadingMenu {scrollStart} {ptk} {booksOfItems}/>
    {/if}

    </ExcerptBar>

    {#if showheading}
    <HeadingList {ptk} {side} items={filtersResult} {onKeyword} {onScroll}/>
    {:else}
    <ExcerptList {ptk} {side} items={selectedExcerptitems} {tofind} {posting} {onScroll}/>
    {/if}
{/if}
</div>
<style>
    :global(.tofind) {width:15em}
</style>