<script>
    import {vstates} from './store.js';

    export let key=''
    export let text=''
    export let address=''
    export let ptk=null;
    export let col=0;
    const vstate=vstates[col];
    const click=async evt=>{
        if (address) {
            const items=await ptk.fetch(address);
            vstate.set(Object.assign($vstate,{items,address}));
        }
    }
</script>
<div>
    <div class="tocitem" class:address on:click={click}>{text||(ptk&&ptk.getLine(key))}</div>
</div>

<style>
    .address {cursor:pointer}
    .address:hover{color:var(--highlight)}
</style>