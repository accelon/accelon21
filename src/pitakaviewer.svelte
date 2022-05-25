<script>
import {useBasket,FULLTEXT_KEY, ALIGNED_KEY, DEFAULT_LANGUAGE} from 'pitaka'
import {debounce} from 'pitaka/utils'
import {parseAddress,stringifyAddress } from 'pitaka/offtext';
import ExcerptBar from './excerptbar.svelte'
import AutoComplete from './3rdparty/simpleautocomplete.svelte'
import ExcerptList from './excerptlist.svelte'
import HeadingCount from './comps/headingcount.svelte'
import HeadingMenu from './headingmenu.svelte'
import HeadingList from './headinglist.svelte'
import {setAddress} from './js/addresses.js'
import {fatalerror,tosim,_} from './js/store.js';
import {queryhistory,QUERYSEP,addqueryhistory,delqueryhistory} from './js/query.js'

export let side=0,address='',active=false ;
let ptk, showheading , criteria , addr ,tofind='', aligned='',scrollStart=0 , qhis;
let excerpts=[], alignedPitaka=[] ,selectedheadings={},
 chunks=[] , books=[], phrases=[], postings=[], candidates=[] ;
const refreshQuery=async _addr=>{
	if (!ptk) { //initial setting
		tofind=_addr[FULLTEXT_KEY]||'';
		aligned=_addr[ALIGNED_KEY]||'';
	}
	ptk=useBasket(_addr.basket);
	if (!ptk) {
		fatalerror.set("cannot open pitaka "+_addr.basket);
		return;
	} else {
		alignedPitaka=ptk.aligned && ptk.aligned.map(n=>useBasket(n))
	}
	criteria=ptk.stringifyCriteria(_addr);
	addr=_addr;
	await updateCriteria();
}
const updateTofind=()=>{
	const cobj=ptk.parseCriteria(criteria);
	cobj[FULLTEXT_KEY]=tofind;
	criteria=ptk.stringifyCriteria(cobj);
}
const updateCriteria=async (updateurl)=>{
	[books,chunks,excerpts]=await ptk.cascadeCriteria(criteria, {scoring:true});

	if (ptk.criteria[FULLTEXT_KEY]) {
		const r=ptk.criteria[FULLTEXT_KEY].result; //r.scores contains all excerpts
		if (r) {
			postings=r.postings;
			phrases=r.phrases;
		}
	} else {
		postings=[];
		phrases=[];
	}
	selectedheadings={}
	if (updateurl) updateURL();
}
const updateURL=()=>{
	const cobj=ptk.parseCriteria(criteria);
	cobj[FULLTEXT_KEY]=tofind;
	cobj[ALIGNED_KEY]=aligned;
	const newaddr=Object.assign(addr, cobj);
	address=stringifyAddress(newaddr, true);
	active&&setAddress(side,address);
	return cobj;
}
const onEscape=()=>showheading=!showheading;
const onScroll=topline=> scrollStart=topline;
const filterExcerptByHeading=(excerpts,selectedheadings)=>{
    if (Object.keys(selectedheadings).length==0) return excerpts;
    const filtered=excerpts.filter(it=> selectedheadings[it.chunk]); //chunk is 3rd items
    return filtered;
}
const onTofind=evt=>updateCriteria(true);
const showChunkExcerpt=chunk=>{
	showheading=false;
	selectedheadings={[chunk]:true}
}
$: refreshQuery(parseAddress(address));
$: updateTofind(tofind);
$: updateCriteria(true,criteria);
$: updateURL(aligned);

$: aptk=alignedPitaka.filter(it=>it.hasBook( ptk.getBook(books).map(i=>i.id) )).map(it=>{
    return {name:it.name, label:_(lang,it.header.title,$tosim)}
})
$: excerptItems= excerpts.map(([y,score,chunk],idx )=>{ return { y, chunk, score ,idx}})
$: selectedExcerptitems = filterExcerptByHeading(excerptItems, selectedheadings); 
$: lang=ptk&&ptk.header.lang||DEFAULT_LANGUAGE;
$: qhis=queryhistory(lang,true);
$: candidates=tofind.length?ptk&&ptk.prefixLemma(tofind) : queryhistory(lang);
$: searchable=ptk && ptk.header.fulltextsearch;
$: deletable= qhis && ~$qhis.indexOf(tofind) && tofind.length;
$: addable = tofind.length>1 && !deletable && excerpts.length;

</script>
<div class="container">
{#if ptk}
    <ExcerptBar {showheading} {side} {ptk} {lang} excerpts={excerptItems} bind:selectedheadings >
    <HeadingCount count={chunks.length} bind:showheading enable={searchable}/>
    {#if showheading || !searchable}<HeadingMenu {scrollStart} {ptk} {aptk} bind:aligned bind:criteria/>{/if}
    {#if searchable}
	    <AutoComplete className="tofind" showClear={true} placeholder={_(lang,"檢索 Search")}
	    bind:text={tofind} items={candidates} {onEscape} onInput={debounce(onTofind,250)} onChange={onTofind}/>
	    {#if addable}<span title={_(lang,"加到搜尋記錄 add to history")} on:click={()=>addqueryhistory(tofind,lang)}>★</span>{:else if deletable}<span title={_(lang,"刪除搜尋記錄 remove from history")} on:click={()=>delqueryhistory(tofind,lang)}>☆</span>{/if}
    {/if}
    </ExcerptBar>

    {#if showheading || !searchable}
    <HeadingList {ptk} {side} {chunks} {aligned} {postings} {showChunkExcerpt}/>
    {:else}
    <ExcerptList {ptk} {side} items={selectedExcerptitems} {postings} {phrases} {onScroll}/>
    {/if}
{/if}
</div>