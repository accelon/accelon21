<script>
import PitakaViewer from './pitakaviewer.svelte'
import {addresses,ntab} from './js/store.js'
import FrontPage from './frontpage.svelte';
</script>
<div class="container">
    {#each $addresses as address,tabid (tabid)}
    <div class="tab-content" class:visible={$ntab==tabid}>
        {#if address==='/'}
        <FrontPage {tabid}/>
        {:else}
        <PitakaViewer {tabid} {address}/>
        {/if}
    </div>
    {/each}
</div>

<style>
    .container {overflow: hidden;}
</style>