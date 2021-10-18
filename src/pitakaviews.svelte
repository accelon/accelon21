<script>
import {setContext} from 'svelte'
import PitakaViewer from './pitakaviewer.svelte'
import FrontPage from './frontpage.svelte';
export let addresses,ntab;
setContext('addresses',addresses);
setContext('ntab',ntab);
</script>
<div class="container">
    {#each $addresses as address,tabid (tabid+address)}
    <div class="tab-content" class:visible={$ntab==tabid}>
        {#if address==='/'}
        <FrontPage {tabid}/>
        {:else}
        <PitakaViewer {tabid} {address} />
        {/if}
    </div>
    {/each}
</div>

<style>
    .container {overflow: hidden;}
</style>