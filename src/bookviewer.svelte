<script>
import {writable} from 'svelte/store'
import {useBasket} from 'pitaka';
import { debounce } from 'pitaka/utils';
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import ExcerptBar from './excerptbar.svelte'
import ClusterCount from './comps/clustercount.svelte'
import ClusterList from './clusterlist.svelte'
import ExcerptList from './excerptlist.svelte'
import { parseAddress,stringifyAddress } from 'pitaka/offtext';
import {buildClusterlist} from './js/cluster.js';
import {searchbox,tosim} from './js/store.js';
import {queryhistory,QUERYSEP} from './js/query.js'
import {setAddress} from './js/addresses.js'
export let side=0,visible=false,address='',active=false;
const clusteritems=writable([]);
const excerptitems=writable([]);
let ptk;
let showcluster=true;
let addr={},refreshcount=0;
let keyvalue='',keylabel='', tofind='',scoredLine=[];

const refreshquery=async (_addr)=>{
    let firsttime=false;
    if (!ptk) { //first refresh
        showcluster=!_addr.tf;
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
        buildClusterlist(_addr,scoredLine,clusteritems,excerptitems);
        keylabel=_addr.kl;
        keyvalue=_addr.kv;
        filterclusters={};
    }
    addr=_addr;
    refreshcount++;
}
const onKeyword=(kl,kv)=>{
    const newaddr={...addr, kl,kv}
    const address=stringifyAddress(newaddr);
    setAddress(side,address);
}
const onTofind=()=>{
    if (refreshcount<1) return;  //workaround for init update
    const newaddr={...addr, tf:tofind}
    const address=stringifyAddress(newaddr);
    setAddress(side,address);
}
const filterBy=(excerpts)=>{
    if (Object.keys(filterclusters).length==0) return excerpts;

    return excerpts.filter(it=> filterclusters[it.ncl]);
}
let filterclusters={};
let filterExcerptitems=[];
$: refreshquery(parseAddress(address));
$: qhis=$queryhistory.split(QUERYSEP);
$: filterExcerptitems = filterBy($excerptitems, filterclusters ); 
</script>

<div class="container">
{#if ptk}
    <ExcerptBar {showcluster} {side} {ptk} excerpts={$excerptitems} bind:filterclusters>
    <svelte:component this={ClusterCount} count={$clusteritems.length} bind:showcluster/>
    
    <span class:displaynone={!showcluster}>
    <svelte:component {onKeyword} this={$searchbox[ptk.format]||$searchbox.toc} {ptk} bind:keyvalue bind:keylabel/>
    </span>
    
    <span class:displaynone={showcluster} >
    <AutoComplete className="tofind" showClear={true} bind:text={tofind} items={qhis}  onInput={debounce(onTofind,250)} onChange={onTofind}/>
    </span>

    </ExcerptBar>

    {#if showcluster}
    <ClusterList {ptk} {side} items={clusteritems} {onKeyword}/>
    {:else}
    <ExcerptList {ptk} {side} items={filterExcerptitems}/>
    {/if}
{/if}
</div>
<style>
    :global(.tofind) {width:15em}
</style>