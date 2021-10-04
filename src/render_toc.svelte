<script>
    export let text='';
    export let key='';
    export let tree;
    export let ptk='';
    export let updateItems=null;

const click=evt=>{
    if (tree) {
        const items=ptk.getTree(tree);
        updateItems(items,tree);
    }
    
}
</script>
<div class="tocitem" on:click={click}>{text}</div>

<style>
    .tocitem {cursor:pointer}
    .tocitem:hover{color:var(--highlight)}
</style>