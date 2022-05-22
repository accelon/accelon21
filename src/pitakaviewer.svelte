<script>
import {useBasket} from 'pitaka/basket'
import {parseAddress,stringifyAddress } from 'pitaka/offtext';
import ExcerptBar from './excerptbar.svelte'
import HeadingCount from './comps/headingcount.svelte'
import HeadingMenu from './headingmenu.svelte'
import {setAddress} from './js/addresses.js'
import {fatalerror} from './js/store.js';

export let side=0,address='',active=false;
let ptk, showheading , criteria , addr;
let excerptItems=[];
let selectedheadings=[], booksOfItems=[];
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
   	address=stringifyAddress(newaddr);
	if (updateurl&&active) setAddress(side,address);
	const r=await ptk.cascadeCriteria(criteria);
}

$: refreshQuery(parseAddress(address));
$: updateCriteria(true,criteria);
$: headingcount=0;

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
    <HeadingCount count={headingcount} bind:showheading enable={searchable}/>

    {#if showheading || !searchable}<HeadingMenu {scrollStart} {ptk} bind:criteria/>{/if}
    </ExcerptBar>
{/if}
</div>