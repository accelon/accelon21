<script>
import {setContext} from 'svelte'

import PageViewer from './pageviewer.svelte'
import ExcerptViewer from './excerptviewer.svelte'
import FrontPage from './frontpage.svelte';
import {showFrontPage} from './js/store.js'
export let addresses,side;
export let hide=false;
setContext('addresses',addresses);

</script>
<div class="container">
    
    {#each $addresses as address,idx (address.key)}
        <div class="tab-content" class:visible={!hide&&idx===0 && (!$showFrontPage || side===1) }>
            {#if address.addr[0]=='{'}
            <ExcerptViewer {side} address={address.addr} active={!hide&&idx===0}/>
            {:else}
            <PageViewer {side} address={address.addr} active={!hide&&idx===0}/>
            {/if}
        </div>
    {/each}
    <FrontPage hidden={ $addresses.length && (!$showFrontPage || side===1) } />
</div>

<style>
    .container {overflow: hidden;}
</style>