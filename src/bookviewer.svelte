<script>
import {writable} from 'svelte/store'
import {useBasket} from 'pitaka';
import { debounce } from 'pitaka/utils';
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import ExcerptBar from './excerptbar.svelte'
import BookCount from './comps/bookcount.svelte'
import BookList from './booklist.svelte'
import ExcerptList from './excerptlist.svelte'
import { parseAddress,stringifyAddress } from 'pitaka/offtext';
import {buildBooklist} from './js/books.js';
import {searchbox,tosim} from './js/store.js';
import {queryhistory,QUERYSEP} from './js/query.js'
import {setAddress} from './js/addresses.js'
export let side=0,visible=false,address='',active=false;
const bookitems=writable([]);
const excerptitems=writable([]);
let ptk;
let showbooklist=true;
let addr={};
let keyvalue='',keylabel='', tofind='',scoredLine=[];

const refreshquery=async (_addr)=>{
    ptk=useBasket(_addr.basket);
    let scored=false;
    if (addr.tf!==_addr.tf) {
        if (_addr.tf) {
            const res=await ptk.fulltextSearch(_addr.tf,{excerpt:true,tosim:$tosim});
            scoredLine=res.scoredLine;
            scored=true;
        } else scoredLine=[];
    } 
    if (_addr.kv!==addr.kv || _addr.kl!==addr.kl || scored) {
        buildBooklist(_addr,scoredLine,bookitems,excerptitems);
        keylabel=_addr.kl;
        keyvalue=_addr.kv;
    }
    addr=_addr;
}
const onKeyword=(kl,kv)=>{
    const newaddr={...addr, kl,kv}
    const address=stringifyAddress(newaddr);
    setAddress(side,address);
}
const onTofind=()=>{
    const newaddr={...addr, tf:tofind}
    const address=stringifyAddress(newaddr);
    setAddress(side,address);
}
$: refreshquery(parseAddress(address));
$: qhis=$queryhistory.split(QUERYSEP);

</script>

<div class="container">
{#if ptk}
    <ExcerptBar {side} {ptk}>
    <svelte:component this={BookCount} count={$bookitems.length} bind:showbooklist/>
    
    <span class:displaynone={!showbooklist}>
    <svelte:component {onKeyword} this={$searchbox[ptk.format]||$searchbox.toc} {ptk} bind:keyvalue bind:keylabel/>
    </span>
    
    <span class:displaynone={showbooklist} >
    <AutoComplete className="tofind" showClear={true} bind:text={tofind} items={qhis}  onInput={debounce(onTofind,250)} onChange={onTofind}/>
    </span>


    </ExcerptBar>
    {#if showbooklist}
    <BookList {ptk} items={bookitems} {onKeyword}/>
    {:else}
    <ExcerptList {ptk} items={excerptitems}/>
    {/if}
{/if}
</div>
<style>
    :global(.tofind) {width:15em}
</style>