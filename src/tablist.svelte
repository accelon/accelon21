<script>
import {selectorShown,getOppositeAddresses, newaddrkey,moveTop} from './js/addresses.js'
import { getContext } from 'svelte';
import { get } from 'svelte/store';
export let side=0;
import HumanAddr from './comps/humanaddr.svelte'
const addresses=getContext('addresses');


const copyOpposite=evt=>{
    const opposite=getOppositeAddresses(addresses);
    const addrs=$addresses;
    const newopposite=get(opposite)
    if (newopposite.length && newopposite[0].address!==addrs[0].address) {
        newopposite.unshift({key:newaddrkey(), addr:addrs[0].address});
        opposite.set(newopposite);
    } else selectorShown.set(false)
}
</script>

<div class="tabselector">
    {#each $addresses as {key,address},idx (key)}
    {#if idx===0} 
        <div><HumanAddr address={address} showjuan={true} onclick={copyOpposite} caption={side===0?'⭆':'⭅'}/></div>
    {:else}
    <div><HumanAddr address={address} showjuan={true} onclick={()=>moveTop(addresses,idx)}/></div>
    {/if}
    {/each}
</div>
