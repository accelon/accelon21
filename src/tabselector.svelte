<script>
import {getContext} from 'svelte'
import {closetab,selectorShown} from './js/addresses.js'
import TabList from './tablist.svelte'
export let side=0;
const addresses=getContext('addresses');
$: closetabbutton = $addresses.length<2;
const onclick=()=>{
    if (closetabbutton) {
        closetab(addresses);
    } else {
        $selectorShown=!$selectorShown
    }
}

</script>
<span class="clickable tabcount" class:closetabbutton on:click={onclick}>
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
    .closetabbutton {padding-left:8px;padding-right:8px;cursor:pointer}
    .closetabbutton:hover:before {color:red;content:'✖';display:inline-block;width:0px} 
</style>