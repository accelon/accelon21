<script>
import {_,tosim} from "./js/store.js";
import {addqueryhistory,activetofind} from "./js/query.js";
export let items=[];
const openexcerpt=()=>{
    addqueryhistory($activetofind)
}
</script>
<span>
{#each items as item}
{#if item.count}
    <span class="clickable labeltext_query" on:click={openexcerpt} label={_(item.caption,$tosim)} >
    {item.count} </span>
{/if}
{/each}
</span>