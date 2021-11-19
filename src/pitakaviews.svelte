<script>
import {setContext} from 'svelte'
import PitakaViewer from './pitakaviewer.svelte'
import FrontPage from './frontpage.svelte';

export let addresses,side;
export let hide=false;
setContext('addresses',addresses);

</script>
<div class="container">
    {#if $addresses.length}
        {#each $addresses as address,idx (idx+address)}
        <div class="tab-content" class:visible={!hide&&idx==0}>
            <PitakaViewer {side} {address} visible={idx==0} />
        </div>
        {/each}
    {:else}
        <FrontPage />
    {/if}
</div>

<style>

    .container {overflow: hidden;}
</style>