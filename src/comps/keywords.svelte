<script>
export let ptk
export let label;
export let onKeyword;
export let keyid; // integer or array of integer
$: if (typeof keyid==='number') keyid=[keyid];
const setkeyword=(label,keyid)=>{
    onKeyword && onKeyword(label,keyid);
}
$: lbl=ptk.getLabel(label);
</script>

{#each keyid as id (id+lbl.name)}
<span on:click={()=>setkeyword(label,lbl.keys[id])}>{lbl.keys[id]}</span>
{/each}

<style>

</style>