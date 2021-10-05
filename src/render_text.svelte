<script>
    import {vstates} from './store.js';
    import {composeSnippet,OfftextToSnippet} from 'pitaka/offtext'

    export let key=''
    export let text=''
    export let address=''
    export let ptk=null;
    export let col=0;
    const vstate=vstates[col];
    const click=async evt=>{
        if (address) {
            const items=ptk.fetch(address);
            await ptk.prefetchLines(items[0].key,items.length);
            vstate.set(Object.assign($vstate,{items,address}));
        }
    }
</script>
<div>
{#if address}
    <div class="tocitem" class:address on:click={click}>{text||(ptk&&ptk.getLine(key))}</div>
{:else}
    {#each OfftextToSnippet(ptk.text||ptk.getLine(key)) as s}
    {@html composeSnippet(s)}
    {/each}
{/if}
</div>

<style>
    .address {cursor:pointer}
    .address:hover{color:var(--highlight)}
</style>