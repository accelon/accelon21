<script>
import {_,tosim} from '../js/store.js';
export let ptk
export let label;
export let onKeyword;
export let keyid=[]; // integer or array of integer
$: if (typeof keyid==='number') keyid=[keyid];
const setkeyword=(label,keyid)=>{
    onKeyword && onKeyword(label,keyid);
}
$: lbl=ptk.getLabel(label);
</script>
{#each keyid as id }
<span on:click={()=>setkeyword(label,lbl.keys[id])}>{_(lbl.keys[id],$tosim)}</span>
{/each}

<style>

</style>