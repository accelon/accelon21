<script>
import {onMount} from 'svelte';
import {writable} from 'svelte/store'
import {useBasket} from 'pitaka';
import {unpackJSONString} from 'pitaka/utils';
import ExcerptBar from './excerptbar.svelte'
import BookList from './booklist.svelte'
import ExcerptList from './excerptlist.svelte'
export let side=0,visible=false,address='',active=false;
const bookitems=writable([]);
const excerptitems=writable([]);
let ptk=null;
let attrs={};
let showbooklist=true;
onMount(async ()=>{
    try {
        attrs=JSON.parse(unpackJSONString(addr));
        ptk=useBasket(attrs.ptk);
    } catch(e){
        console.error(e);
    }
    const {scoredLine}=await ptk.runQuery(attrs.qm||'*',attrs.tf,{excerpt:true});
    
    const out=scoredLine.map(([y,score],key)=>{return {ptk,key, y,score}});
    bookitems.set(ptk.getLabel('bk').names.map((text,key)=>{return {key, text}}));
    excerptitems.set(out);
});

</script>

<div class="container">
<div><ExcerptBar {side} bind:showbooklist {ptk}  bookcount={$bookitems.length}/></div>
{#if showbooklist}
<BookList {ptk} items={bookitems}/>
{:else}
<ExcerptList {ptk} items={excerptitems}/>
{/if}
</div>
<style>

</style>