<script>

import {getContext} from 'svelte'
import {settab} from './js/addresses.js';
import InputNumber from './comps/inputnumber.svelte';
import { PATHSEP } from 'pitaka';

const vstore=getContext('vstore');

$: ptk=$vstore.ptk;
$: loc=$vstore.loc;

const addresses=getContext('addresses');

$: childcount=ptk&&ptk.childCount(loc) ;
$: value=loc&&parseInt(loc.match(/(\d+)$/)[1]);

const go=({ctrlKey,detail})=>{
    const newloc=loc.replace(/\d+$/,detail);
    settab(addresses,newloc,{newtab:ctrlKey});
}
</script>

{#if childcount>1}
<InputNumber on:change={go} autofocus={true} {value} max={childcount} min="1" />
{/if}
<style>

</style>