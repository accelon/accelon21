<script>
import {onMount} from 'svelte';
import {writable} from 'svelte/store'
import {useBasket} from 'pitaka';
import {unpackJSONString} from 'pitaka/utils';
import VirtualScroll from './3rdparty/virtualscroll'
import ExcerptLine from './render_excerpt.svelte';
export let side=0,visible=false,address=0;
let vscroll;
const scroll=evt=>{return true};
const excerptitems=writable([]);
const ptk=useBasket('cb-y');
const out=[];
let pageattrs={};
onMount(()=>{
    try {
        pageattrs=JSON.parse(unpackJSONString(address));
        console.log(pageattrs);
    } catch(e){
        console.error(e);
    }
    for (let i=0;i<100;i++) {
            out.push({ptk,key:i,y:Math.floor(Math.random()*20000)})
    }
    excerptitems.set(out);
});

</script>

<div class="container">
    EXCERPT
<VirtualScroll start={-1} bind:this={vscroll} keeps={15} data={$excerptitems} key="key" 
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