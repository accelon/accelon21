<script>
import {settab} from './js/addresses.js';
import InputNumber from './comps/inputnumber.svelte';
import { stringifyAddress } from 'pitaka/offtext';
export let ptk;
export let loc;
export let side=0;

$: childcount=ptk&&ptk.childCount(loc) ;
$: value=loc&&loc.match(/(\d+)$/) && parseInt(loc.match(/(\d+)$/)[1]);

const go=({detail})=>{
    const newloc= stringifyAddress({
        basket:ptk.header.name,loc:loc.replace(/\d+$/,detail)});
    settab(side,newloc);
}
</script>

{#if childcount>1}
<InputNumber on:change={go} {value} max={childcount} min="1" />
{/if}
<style>

</style>