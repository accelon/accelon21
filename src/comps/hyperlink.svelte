<script>
import {newopposite} from '../js/addresses';
export let side=0;
export let href='';
const openlink=evt=>{
    newopposite(side,href);
}

</script>
{#if href}
<span class='clickable' on:click={openlink}>{side?'⭅':'⭆'}</span>
{/if}