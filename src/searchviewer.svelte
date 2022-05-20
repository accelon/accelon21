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
import {buildHeadingList,createFilterOptionStore,filteredByOption} from './js/heading.js';
import {searchbox,tosim, _} from './js/store.js';
import {queryhistory,QUERYSEP,addqueryhistory,delqueryhistory} from './js/query.js'
import {setAddress} from './js/addresses.js'
import {setContext} from 'svelte';
import {toSim} from 'lossless-simplified-chinese'
export let side=0,address='',active=false;
export let visible=false;
let ptk,oldptk;

// optionsStore.set(O);

export const headings=writable([]);  
export const filterings=writable([]);
export const excerptitems=writable([]);
export const filtersOptions=writable([]);
export const filtersResult=writable([]);

let filteredStore;

// $: console.log('filter result',$reducedFilteredStore)
$: filteredStore &&  filtersResult.set(typeof $filteredStore=='number'?ptk.allHeadings(true):$filteredStore); 


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
let tofind='',scoredLine=[], postings=[] , phrases=[];
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
    } else oldptk=ptk;

    ptk=useBasket(_addr.basket);

    let scored=false;
    // console.log('filterresult',$filtersResult.length,addr.tf,_addr.tf)
    if (addr.tf!==_addr.tf || $filtersResult.length) {
        if (_addr.tf) {
            const ranges=ptk.getHeadingRanges($filtersResult);
            const res=await ptk.fulltextSearch(_addr.tf,{excerpt:true,tosim:$tosim,ranges});
           if (res) {
                 scoredLine=res.scoredLine;
                 postings=res.postings;
                 phrases=res.phrases;
                 scored=true;
                 tofind=_addr.tf;
            }
        } else scoredLine=[];
    } 
    if (_addr.kv!==addr.kv || _addr.kl!==addr.kl || scored ||firsttime || ptk!==oldptk) {
        booksOfItems=buildHeadingList(_addr,scoredLine,excerptitems);
        selectedheadings={};
    }
    addr=_addr;
    refreshcount++;

    if (oldptk!==ptk) {
        filtersOptions.set(createFilterOptionStore(ptk));
        filteredStore=filteredByOption(get(filtersOptions));
    }
    oldptk=ptk;
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
$: qhis=queryhistory(lang,true);
$: candidates=tofind.length?ptk.prefixLemma(tofind) : queryhistory(lang);
$: lang=ptk&&ptk.header.lang;
$: selectedExcerptitems = filterExcerptByHeading($excerptitems, selectedheadings); 
$: deletable=~ $qhis.indexOf(tofind) && tofind.length;
$: addable = tofind.length>1 && !deletable && $excerptitems.length;
$: searchable=ptk&& ptk.header.fulltextsearch;
</script>

<div class="container">
{#if ptk}
    <ExcerptBar {showheading} {side} {ptk} excerpts={$excerptitems} bind:selectedheadings>
    <HeadingCount count={$filtersResult.length} bind:showheading enable={searchable}/>
    <!-- <span class:displaynone={!showheading}>
    <svelte:component {onKeyword} this={$searchbox[ptk.format]||$searchbox.toc} {ptk} bind:keyvalue bind:keylabel/>
    </span> -->

{#if searchable}
    <AutoComplete className="tofind" showClear={true} 
    placeholder={_("檢索 Search")} {itemFilterFunction}
    bind:text={tofind} items={candidates}  onInput={debounce(onTofind,250)} onChange={onTofind}/>
    {#if addable}<span title={_("加到搜尋記錄 add to history")} on:click={()=>addqueryhistory(tofind,lang)}>★</span>{:else if deletable}<span title={_("刪除搜尋記錄 remove from history")} on:click={()=>delqueryhistory(tofind,lang)}>☆</span>{/if}
{/if}
    {#if showheading || !searchable}
    <HeadingMenu {scrollStart} {ptk} {booksOfItems}/>
    {/if}

    </ExcerptBar>

    {#if showheading || !searchable}
    <HeadingList {ptk} {side} items={filtersResult} {onKeyword} {onScroll}/>
    {:else}
    <ExcerptList {ptk} {side} items={selectedExcerptitems}  {postings} {phrases} {onScroll}/>
    {/if}
{/if}
</div>
<style>
    :global(.tofind) {width:15em}
</style>