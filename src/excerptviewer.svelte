<script>
import {onMount} from 'svelte';
import {writable} from 'svelte/store'
import {useBasket} from 'pitaka';
import {unpackJSONString} from 'pitaka/utils';
import VirtualScroll from './3rdparty/virtualscroll'
import ExcerptLine from './render_excerpt.svelte';
export let side=0,visible=false,address=0,active=false;
let vscroll;
const scroll=evt=>{return true};
const excerptitems=writable([]);
let ptk=null;
const out=[];
let attrs={};
onMount(async ()=>{
    try {
        attrs=JSON.parse(unpackJSONString(address));
        ptk=useBasket(attrs.ptk);
    } catch(e){
        console.error(e);
    }
    const {scoredLine}=await ptk.runQuery(attrs.qm||'*',attrs.tf,{excerpt:true});
    
    const out=scoredLine.map(([y,score],key)=>{return {ptk,key, y,score}})
    excerptitems.set(out);
});

</script>

<div class="container">
    EXCERPT
<VirtualScroll start={-1} bind:this={vscroll} keeps={25} data={$excerptitems} key="key" 
    let:data on:scroll={scroll}>
    <span class='excerptlinesep'></span>
    {#if typeof data.ptk.getLine(data.y)=='undefined'}
        {#await data.ptk.prefetchLines(data.y,2)}
            <ExcerptLine {...data} loading={true}/>
        {:then}
            <ExcerptLine {...data}/>
        {/await}
    {:else}
        <ExcerptLine {...data}/>
    {/if}
</VirtualScroll>
</div>
<style>
    .excerptlinesep {display:block;height:1px;background-color: darkviolet;}
</style>