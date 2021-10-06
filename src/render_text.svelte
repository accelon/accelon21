<script>
    import {vstates,tosim,texthook,activecolumn} from './js/store.js';
    import {composeSnippet,OfftextToSnippet} from 'pitaka/offtext'
    import {getTextHook} from './js/selection.js';
    export let key=''
    export let text=''
    export let address=''
    export let ptk=null;
    export let col=0;
    const vstate=vstates[col];
    const mouseup=async evt=>{
        if (evt.button!==0) return;
        if (address) {
            const items=ptk.fetch(address);
            await ptk.prefetchLines(items[0].key,items.length);
            vstate.set(Object.assign($vstate,{items,address}));
        } else if (evt.target.tagName=='T') {
            const w=getTextHook(ptk,evt);
            $texthook={col:$activecolumn,hook:w.hook,y:key};
        }
    }
</script>
<div class="linetext" on:mouseup={mouseup}>
{#if address}
<div class="tocitem" class:address>{text||(ptk&&ptk.getLine(key))}</div>
{:else}
{#each OfftextToSnippet(ptk.text||ptk.getLine(key)) as snpt}
{@html composeSnippet(snpt,key,$tosim)}
{/each}
{/if}
</div>

<style>
    .linetext {padding-top:0.5em;line-height:1.8}
    .address {cursor:pointer}
    .address:hover{color:var(--highlight)}
</style>