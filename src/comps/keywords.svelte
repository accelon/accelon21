<script>
export let ptk
export let label;
export let keyid; // integer or array of integer
$: if (typeof keyid==='number') keyid=[keyid];
const setkeyword=(label,keyid)=>{
    onKeyword && onKeyword(label,keyid);
}
const lbl=ptk.getLabel(label);
</script>
<span class="userselectnone">
{#each keyid as id}
<span on:click={()=>setkeyword(label,id)}>{lbl.keys[id]}</span>
{/each}
</span>
<style>

</style>