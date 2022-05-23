<script>
import {FULLTEXT_METHOD,useBasket} from 'pitaka'
import {debounce} from 'pitaka/utils'
import {parseAddress,stringifyAddress } from 'pitaka/offtext';
import ExcerptBar from './excerptbar.svelte'
import AutoComplete from './3rdparty/simpleautocomplete.svelte'
import ExcerptList from './excerptlist.svelte'
import HeadingCount from './comps/headingcount.svelte'
import HeadingMenu from './headingmenu.svelte'
import HeadingList from './headinglist.svelte'
import {setAddress} from './js/addresses.js'
import {fatalerror,_} from './js/store.js';
import {queryhistory,QUERYSEP,addqueryhistory,delqueryhistory} from './js/query.js'

export let side=0,address='',active=false ;
let ptk, showheading , criteria , addr ,tofind='', scrollStart=0 , qhis;
let excerpts=[], selectedheadings=[], booksOfItems=[], chunks=[] , phrases=[], postings=[], candidates=[] ;
const refreshQuery=async _addr=>{
	if (!ptk) { //initial set tofind
		tofind=_addr[FULLTEXT_METHOD]||'';
	}
	ptk=useBasket(_addr.basket);
	if (!ptk) {
		fatalerror.set("cannot open pitaka "+_addr.basket);
		return;
	}
	criteria=ptk.stringifyCriteria(_addr);
	showheading=!tofind.trim();
	addr=_addr;
	await updateCriteria();
}
const updateCriteria=async updateurl=>{
	const cobj=ptk.parseCriteria(criteria);
	cobj[FULLTEXT_METHOD]=tofind;
	const newaddr=Object.assign(addr, cobj);
   	address=stringifyAddress(newaddr, true);
	if (updateurl&&active) setAddress(side,address);
	[chunks,excerpts]=await ptk.cascadeCriteria(criteria, {scoring:true});
	if (cobj[FULLTEXT_METHOD]) {
		const r=ptk.criteria[FULLTEXT_METHOD].result; //r.scores contains all excerpts
		postings=r.postings;
		phrases=r.phrases;
	}
}
const updateUrl=()=>{
	active&&setAddress(side,address);
}

const onScroll=topline=> scrollStart=topline;
const filterExcerptByHeading=(excerpts,selectedheadings)=>{
    if (Object.keys(selectedheadings).length==0) return excerpts;
    const filtered=excerpts.filter(it=> selectedheadings[it.chunk]); //chunk is 3rd items
    return filtered;
}
const onTofind=()=>updateCriteria(true);

$: excerptItems= excerpts.map(([y,score,chunk] )=>{ return { y, chunk, score}})
$: refreshQuery(parseAddress(address));
$: updateCriteria(true,criteria);
$: selectedExcerptitems = filterExcerptByHeading(excerptItems, selectedheadings); 
$: lang=ptk&&ptk.header.lang;
$: qhis=queryhistory(lang,true);
$: candidates=tofind.length?ptk&&ptk.prefixLemma(tofind) : queryhistory(lang);
$: searchable=ptk && ptk.header.fulltextsearch;
$: deletable= qhis && ~ $qhis.indexOf(tofind) && tofind.length;
$: addable = tofind.length>1 && !deletable && excerpts.length;

</script>

<div class="container">
{#if ptk}
    <ExcerptBar {showheading} {side} {ptk} excerpts={excerptItems} bind:selectedheadings >
    <HeadingCount count={chunks.length} bind:showheading enable={searchable}/>
    {#if showheading || !searchable}<HeadingMenu {scrollStart} {ptk} bind:criteria/>{/if}


    {#if searchable}
        <AutoComplete className="tofind" showClear={true} placeholder={_("檢索 Search")}
    bind:text={tofind} items={candidates}  onInput={debounce(onTofind,250)} onChange={onTofind}/>
    {#if addable}<span title={_("加到搜尋記錄 add to history")} on:click={()=>addqueryhistory(tofind,lang)}>★</span>{:else if deletable}<span title={_("刪除搜尋記錄 remove from history")} on:click={()=>delqueryhistory(tofind,lang)}>☆</span>{/if}
    {/if}

    </ExcerptBar>

    {#if showheading || !searchable}
    <HeadingList {ptk} {side} {chunks} {postings}/>
    {:else}
    <ExcerptList {ptk} {side} items={selectedExcerptitems}  {postings} {phrases} {onScroll}/>
    {/if}
{/if}
</div>