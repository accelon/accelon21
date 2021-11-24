<script>
import {settab} from './js/addresses.js';
import InputNumber from './comps/inputnumber.svelte';
export let ptk;
export let loc;
export let side=0;

$: childcount=ptk&&ptk.childCount(loc) ;
$: value=loc&&parseInt(loc.match(/(\d+)$/)[1]);

const go=({detail})=>{
    const newloc=loc.replace(/\d+$/,detail);
    settab(side,newloc);
}
</script>

{#if childcount>1}
<InputNumber on:change={go} {value} max={childcount} min="1" />
<input placeholder='pagenumber' value="30" maxlength={5}/>
{/if}
<style>
input {width:2.5em}
</style>