<script>
import {getContext} from "svelte"
import {writable,derived} from "svelte/store"
import {filterer} from "./js/store.js"
import {intersect} from "pitaka/utils"
import {createFilterOptionStore,filtererOf} from "./js/heading.js"
export let ptk;
const filtersOptions=getContext('filtersOptions');
// const filtersResult=getContext('filtersResult');
const filters=ptk.getHeadingFilters();

// filtersOptions.set(createFilterOptionStore(ptk))
const O=$filtersOptions;
</script>
<div>
    {#each filters as F}
    <svelte:component {...F} {ptk} store={O[ filtererOf(ptk,F) ]}
        this={$filterer[filtererOf(ptk,F)]||$filterer.default}></svelte:component>
    {/each}
</div>