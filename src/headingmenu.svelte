<script>
import Hamburgermenu from './comps/hamburgermenu.svelte';
import Buttons from './comps/buttons.svelte';
import CriteriaPanel from './criteriapanel.svelte';
export let criteria;
export let ptk;
export let scrollStart=0;
let showmode=2;//display for whole page
$: criteriaObj=ptk.parseCriteria(criteria);
const updateQuery=(method,query)=>{
    criteriaObj[method]=query;
    const newcriteria=ptk.stringifyCriteria(criteriaObj);
    if (newcriteria!==criteria) {
        criteria=newcriteria;
    }
}

// import HeadingFilter from './headingfilter.svelte';
// import {useBasket} from 'pitaka'
// import {getContext} from 'svelte'
// import {_,tosim} from './js/store.js'
// export let booksOfItems=[];
// const alignedPitaka=(ptk.aligned && ptk.aligned.map(n=>useBasket(n)))||[];
// const bkstore=getContext('bkstore');
// const alignablePitakas=alignedPitaka.filter(it=>it.hasBook(booksOfItems)).map(it=>{
//     return {name:it.name, label:_(it.header.title,$tosim)}
// })
</script>
<Hamburgermenu {scrollStart} {showmode}>
    <!-- <Buttons bind:values={$bkstore.aligned} items={alignablePitakas} /> -->
    <!-- {#if alignablePitakas.length}<hr/>{/if} -->
    <CriteriaPanel {ptk} {criteria} {updateQuery} />
</Hamburgermenu>