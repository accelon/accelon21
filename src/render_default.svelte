<script>
    import {vstates,vlines,tosim,setLoc,cursor} from './js/store.js';
    import {composeSnippet,OfftextToSnippet} from 'pitaka/offtext'
    import {getTextHook} from './js/selection.js';
    import LineMenu from './linemenu.svelte';
    export let key=''
    export let text=''
    export let loc=''
    export let ptk=null;
    export let col=0;
    const vstate=vstates[col];
    const vl=vlines[col];
    const mouseup=async evt=>{
        if (evt.button!==0) return;
        if (loc) {
            await setLoc(ptk,col,loc);
        } else if (evt.target.tagName=='T') {
            const {hook,y,sel,t,ori}=getTextHook(ptk,evt);
            cursor.set({sel,t,ori});
            vstate.set(Object.assign($vstate,{hook,y,len:sel.length}))
        }
    }
</script>
<div class="linetext" on:mouseup={mouseup}>
{#if loc}
<div class="tocitem" class:loc>{text||(ptk&&ptk.getLine(key))}</div>
{:else}
{#if $vstate.y==key}<LineMenu {loc} {col} y={key} {ptk}/>{/if}
{#each OfftextToSnippet(ptk.text||ptk&&ptk.getLine&&ptk.getLine(key)) as snpt}
{@html composeSnippet(snpt,key,$tosim)}
{/each}
{/if}
</div>

<style>
    .linetext {padding-top:0.5em;line-height:1.8}
    .loc {cursor:pointer}
    .loc:hover{color:var(--highlight)}
</style>