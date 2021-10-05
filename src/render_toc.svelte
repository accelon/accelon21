<script>
    export let text='';
    export let address;
    export let ptk='';

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