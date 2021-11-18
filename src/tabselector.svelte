<script>
import {getside,selectorShown,getOppositeAddresses} from './js/addresses.js'
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
    if (addrs[0]===PATHSEP) return;
    const newopposite=get(opposite)
    if (newopposite[0]!==addrs[0]) {
        newopposite.unshift(addrs[0]);
        opposite.set(newopposite);
    } else selectorShown.set(false)
}
</script>
<HumanAddr address={$addresses[0]} onclick={()=>$selectorShown=!$selectorShown}/>
{#if $selectorShown}
<div class="tabselector">
    {#each $addresses as address,idx (idx+address)}
    {#if idx===0 && address!==PATHSEP} 
        <div><HumanAddr {address} showjuan={true} onclick={copyOpposite} caption={getside()=='a'?'⭆':'⭅'}/></div>
    {:else}
    <div><HumanAddr {address} showjuan={true} onclick={()=>moveTop(idx)}/></div>
    {/if}
    {/each}
</div>
{/if}
