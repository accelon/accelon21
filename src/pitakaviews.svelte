<script>
import {setContext} from 'svelte'
import FrontPage from './frontpage.svelte';
import {showFrontPage} from './js/store.js'
export let addresses,side;
export let hide=false;

import BookViewer from './bookviewer.svelte'
import ChunkViewer from './chunkviewer.svelte'
import { parseAddress } from 'pitaka/offtext';

setContext('addresses',addresses);
const getViewer=address=>{
    const addr=parseAddress(address);
    return addr.loc?ChunkViewer:BookViewer;
}

</script>
<div class="container">
    {#each $addresses as {key,address},idx (key)}
        <div class="tab-content" class:visible={!hide&&idx===0 && (!$showFrontPage || side===1) }>
            <svelte:component this={getViewer(address)} {address} {side} active={!hide&&idx===0}/>
        </div>
    {/each}
    <FrontPage {side} hidden={ $addresses.length && (!$showFrontPage || side===1) } />
</div>

<style>
    .container {overflow: hidden;}
</style>