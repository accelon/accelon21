<script>
import {setContext} from 'svelte'
import PitakaViewer from './pitakaviewer.svelte'
import FrontPage from './frontpage.svelte';
import Btn from './comps/button.svelte'
export let addresses,ntab;
export let hide=false;
setContext('addresses',addresses);
setContext('ntab',ntab);
</script>
<div class="container">
    
    {#each $addresses as address,tabid (tabid+address)}
    <div class="tab-content" class:visible={!hide&&$ntab==tabid}>
        {#if address==='/'}
        <FrontPage {tabid}/>
        {:else}
        <PitakaViewer {tabid} {address} visible={$ntab==tabid} />
        {/if}
    </div>
    {/each}
</div>

<style>

    .container {overflow: hidden;}
</style>