<script>
import {setContext} from 'svelte'
import PitakaViewer from './pitakaviewer.svelte'
import FrontPage from './frontpage.svelte';
import { PATHSEP } from 'pitaka';

export let addresses,side;
export let hide=false;
setContext('addresses',addresses);

</script>
<div class="container">
    {#each $addresses as address,idx (idx+address)}
    <div class="tab-content" class:visible={!hide&&idx==0}>
        {#if address===PATHSEP}
        <FrontPage />
        {:else}
        <PitakaViewer {side} {address} visible={idx==0} />
        {/if}
    </div>
    {/each}
</div>

<style>

    .container {overflow: hidden;}
</style>