<script>
    export let text='';
    export let key='';
    export let address;
    export let ptk='';
    export let updateItems=null;

const click=evt=>{
    if (address) {
        const items=ptk.fetch(address);
    }
    
}
</script>
<div class="tocitem" {address} on:click={click}>{text}</div>

<style>
    .tocitem {cursor:pointer}
    .tocitem:hover{color:var(--highlight)}
</style>