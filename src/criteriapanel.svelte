<script>
import {debounce} from 'pitaka/utils'
export let ptk;
export let criteria;
export let updateQuery;
export let lang;
import {filtererOf} from './js/filterer.js'
$: filterers=filtererOf(ptk,criteria);

const update=debounce((method,query)=>updateQuery&&updateQuery(method,query),250);

</script>

{#each filterers as f }
<div><svelte:component this={f.component} {...f} {update} {lang}/></div>
{/each}