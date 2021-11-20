<script>
import {setContext} from 'svelte'
import PitakaViewer from './pitakaviewer.svelte'
import ExcerptViewer from './excerptviewer.svelte'
import FrontPage from './frontpage.svelte';

export let addresses,side;
export let hide=false;
setContext('addresses',addresses);

</script>
<div class="container">
    {#if $addresses.length}
        {#each $addresses as address,idx (address.key)}
        <div class="tab-content" class:visible={!hide&&idx===0}>
            {#if address.addr[0]=='{'}
            <ExcerptViewer {side} address={address.addr} active={!hide&&idx===0}/>
            {:else}
            <PitakaViewer {side} address={address.addr} active={!hide&&idx===0}/>
            {/if}
        </div>
        {/each}
    {:else}
    {#if !hide}<FrontPage/>{/if}
    {/if}
</div>

<style>
    .container {overflow: hidden;}
</style>