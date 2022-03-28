<script>
import {newopposite} from '../js/addresses';
export let side=0;
export let href='';
export let title='';
const openlink=evt=>{
    newopposite(side,href);
}

</script>
{#if href}
<span class='clickable' {title} on:click={openlink}>{side?'⭅':'⭆'}</span>
{/if}