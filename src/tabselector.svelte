<script>
import {getside,selectorShown,getOppositeAddresses, newaddrkey} from './js/addresses.js'
import { getContext } from 'svelte';
import { get } from 'svelte/store';

import HumanAddr from './comps/humanaddr.svelte'
import { PATHSEP } from 'pitaka';
const addresses=getContext('addresses');

const moveTop=idx=>{
    if (idx<1)return;
    const addrs=$addresses;
    const top=addrs.splice(idx,1)[0];
    addrs.unshift(top);
    addresses.set(addrs);
}
const copyOpposite=evt=>{
    const opposite=getOppositeAddresses(addresses);
    const addrs=$addresses;
    const newopposite=get(opposite)
    if (newopposite[0].addr!==addrs[0].addr) {
        newopposite.unshift({key:newaddrkey(), addr:addrs[0].addr});
        opposite.set(newopposite);
    } else selectorShown.set(false)
}
</script>
<span class="pitaka_tocbartitle">
<HumanAddr address={$addresses[0].addr} onclick={()=>$selectorShown=!$selectorShown}/>
</span>
{#if $selectorShown}
<div class="tabselector">
    {#each $addresses as address,idx (address.key)}
    {#if idx===0} 
        <div><HumanAddr address={address.addr} showjuan={true} onclick={copyOpposite} caption={getside()=='a'?'⭆':'⭅'}/></div>
    {:else}
    <div><HumanAddr address={address.addr} showjuan={true} onclick={()=>moveTop(idx)}/></div>
    {/if}
    {/each}
</div>
{/if}
