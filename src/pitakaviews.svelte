<script>
import {setContext} from 'svelte'
import FrontPage from './frontpage.svelte';
import {showFrontPage,viewers} from './js/store.js'
import { parsePointer } from 'pitaka/offtext';
export let addresses,side;
export let hide=false;

setContext('addresses',addresses);

const getViewer=addr=>{
    const ptr=parsePointer(addr);
    const v= $viewers[ptr.v]||$viewers.default;
    return v;
}


</script>
<div class="container">
    {#each $addresses as {key,addr},idx (key)}
        <div class="tab-content" class:visible={!hide&&idx===0 && (!$showFrontPage || side===1) }>
            <svelte:component this={getViewer(addr)} {addr} {side} active={!hide&&idx===0}/>
        </div>
    {/each}
    <FrontPage {side} hidden={ $addresses.length && (!$showFrontPage || side===1) } />
</div>

<style>
    .container {overflow: hidden;}
</style>