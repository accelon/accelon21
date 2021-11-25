<script>
import {onMount} from 'svelte';
import {writable} from 'svelte/store'
import {useBasket} from 'pitaka';
import ExcerptBar from './excerptbar.svelte'
import BookCount from './comps/bookcount.svelte'
import BookList from './booklist.svelte'
import ExcerptList from './excerptlist.svelte'
import { parseAddress } from 'pitaka/offtext';
import {searchbox} from './js/store.js'
import {findBooks} from './js/books.js'
export let side=0,visible=false,address='',active=false;
const bookitems=writable([]);
const excerptitems=writable([]);
let ptk;
let showbooklist=true;
let query=''
const addr=parseAddress(address);
onMount(async ()=>{
    try {
        ptk=useBasket(addr.basket);
    } catch(e){
        console.error(e);
    }
    const {scoredLine}=await ptk.runQuery(addr.qm||'*',addr.tf,{excerpt:true});
    
    const out=scoredLine.map(([y,score],key)=>{return {ptk,key, y,score}});

    query=addr.tf;

    /// excerptitems.set(out);
});
$: ptk&&bookitems.set(findBooks(ptk,query ));
</script>

<div class="container">
{#if ptk}
    <ExcerptBar {side} {ptk}>
    <svelte:component this={BookCount} count={$bookitems.length} bind:showbooklist/>
    {#if showbooklist}
    <svelte:component this={$searchbox[ptk.format]||$searchbox.toc} {ptk} bind:query/>
    {/if}
   
   
    </ExcerptBar>

    {#if showbooklist}
    <BookList {ptk} items={bookitems}/>
    {:else}
    <ExcerptList {ptk} items={excerptitems}/>
    {/if}
{/if}
</div>


<style>

</style>