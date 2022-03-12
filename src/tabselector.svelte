<script>
import {getContext} from 'svelte'
import {closetab,selectorShown} from './js/addresses.js'
import TabList from './tablist.svelte'
export let side=0;
const addresses=getContext('addresses');
const onclick=()=>{
    $selectorShown=!$selectorShown
}

</script>
<span class="clickable tabcount" on:click={onclick}>
    {$addresses.length}
    {#if $selectorShown}
    <TabList {side}/>
    {/if}
</span>
<style>
    .tabcount {
        padding-left:0.5em;
        padding-right:0.5em;
    }
</style>