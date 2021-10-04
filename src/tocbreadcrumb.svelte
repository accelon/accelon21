<script>
export let ptk;
export let tree='';
export let updateItems;
$: title=(ptk && ptk.header && ptk.header.title)||'';
const click=evt=>{
    const tree=evt.target.attributes.tree.value;
    updateItems(ptk.getTree(tree),tree)
}
</script>
<span class="tocitem" on:click={click} tree="">{title}</span>
{#each tree.split(',') as node}
<span class="tocitem" >{(ptk&&node&&('/ '+ptk.getName(node)))||''}</span>
{/each}
<style>
    .tocitem {cursor:pointer}
    .tocitem:hover{color:var(--highlight)}
</style>