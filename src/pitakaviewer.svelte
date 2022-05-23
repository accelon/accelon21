<script>
import {useBasket} from 'pitaka/basket'
import {sleep} from 'pitaka/utils'
import {parseAddress,stringifyAddress } from 'pitaka/offtext';
import ExcerptBar from './excerptbar.svelte'
import HeadingCount from './comps/headingcount.svelte'
import HeadingMenu from './headingmenu.svelte'
import HeadingList from './headinglist.svelte'
import {setAddress} from './js/addresses.js'
import {fatalerror} from './js/store.js';

export let side=0,address='',active=false;
let ptk, showheading , criteria , addr;
let excerpts=[];
let selectedheadings=[], booksOfItems=[] , chunks=[];
const refreshQuery=async _addr=>{
	ptk=useBasket(_addr.basket);
	if (!ptk) {
		fatalerror.set("cannot open pitaka "+_addr.basket);
		return;
	}
	criteria=ptk.stringifyCriteria(_addr);
	addr=_addr;
	await updateCriteria();
}
const updateCriteria=async updateurl=>{
	const cobj=ptk.parseCriteria(criteria);
	const newaddr=Object.assign(addr, cobj);
   	address=stringifyAddress(newaddr, true);
	if (updateurl&&active) setAddress(side,address);
	[chunks,excerpts]=await ptk.cascadeCriteria(criteria);

}
$: excerptItems= excerpts.map(([y,score,chunk] )=>{ return { key:y, chunk, score}})

$: refreshQuery(parseAddress(address));
$: updateCriteria(true,criteria);
$: selectedExcerptitems = filterExcerptByHeading($excerptitems, selectedheadings); 

const updateUrl=()=>{
	active&&setAddress(side,address);
}
let scrollStart=0;
const onScroll=topline=> scrollStart=topline;

$: searchable=ptk && ptk.header.fulltextsearch;
</script>

<div class="container">
{#if ptk}
    <ExcerptBar {showheading} {side} {ptk} excerpts={excerptItems} bind:selectedheadings >
    <HeadingCount count={chunks.length} bind:showheading enable={searchable}/>
    {#if showheading || !searchable}<HeadingMenu {scrollStart} {ptk} bind:criteria/>{/if}
    </ExcerptBar>

    {#if showheading || !searchable}
    <HeadingList {ptk} {side} {chunks}/>
    {:else}
    <ExcerptList {ptk} {side} items={selectedExcerptitems}  {postings} {phrases} {onScroll}/>
    {/if}
{/if}
</div>