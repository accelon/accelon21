<script>
import {getContext} from "svelte"
import {writable,derived} from "svelte/store"
import {filterer} from "./js/store.js"
import {intersect} from "pitaka/utils"
export let ptk;
const optionsStore=getContext('filtersOptions');
const filtersResult=getContext('filtersResult');
const filters=ptk.getHeadingFilters();

const O=$optionsStore;
for (let i=0;i<filters.length;i++) {
    const F=filters[i];
    F.filter;
    if (!F.filter) F.filter=(ptk.isDictionary()?'entry_':'heading_')+ptk.langOf();
    if (! O[F.filter] ) {
        O[F.filter] = writable({name:F.filter,opts:[] , res:[] }); 
    }
}
optionsStore.set(O);

const stores=Object.values(O);
// watching all filters, combine their result with intersection
const result=derived( stores , Stores=>{
    const out=Stores.reduce((o,s,idx)=>{
        // console.log('options changed' ,s.name,s.res )
        if (idx==0) return s.res;
        const k=s.res.length?intersect(o,s.res):o;
        return k;
    },[]);
    return out;
},[]);
$: filtersResult.set($result); 
</script>
<div>
    {#each filters as F}
    <svelte:component {...F} {ptk} store={O[F.filter]}
        this={$filterer[F.filter]||$filterer.default}></svelte:component>
    {/each}
</div>