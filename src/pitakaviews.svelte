<script>
import {setContext} from 'svelte'
import FrontPage from './frontpage.svelte';
import {showFrontPage,viewers} from './js/store.js'
import { parseAddress } from 'pitaka/offtext';
export let addresses,side;
export let hide=false;

setContext('addresses',addresses);

const getViewer=address=>{
    const ptr=parseAddress(address);
    const v= $viewers[ptr.v]||$viewers.default;
    return v;
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