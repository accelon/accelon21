<script>
import Hamburgermenu from './comps/hamburgermenu.svelte';
import Buttons from './comps/buttons.svelte';
import HeadingFilter from './headingfilter.svelte';
import {useBasket} from 'pitaka'
import {_,tosim} from './js/store.js'
import {getContext} from 'svelte'

export let ptk;
export let scrollStart=0;
export let booksOfItems=[];
const alignedPitaka=(ptk.aligned && ptk.aligned.map(n=>useBasket(n)))||[];
const bkstore=getContext('bkstore');
const alignablePitakas=alignedPitaka.filter(it=>it.hasBook(booksOfItems)).map(it=>{
    return {name:it.name, label:_(it.header.title,$tosim)}
}) ;
let showmode=2;//display for whole page
</script>
<Hamburgermenu {scrollStart} {showmode}>
    <Buttons values={$bkstore.aligned} items={alignablePitakas} />
    {#if alignablePitakas.length}<hr/>{/if}
    <HeadingFilter {ptk} />
</Hamburgermenu>