<script>
import VirtualScroll from './3rdparty/virtualscroll'
import ExcerptLine from './render_excerpt.svelte';
export let items=[];
export let ptk, side =0 ;
export let phrases=[];
export let postings=[];
export let onScroll;
let parallels={};
let activeline=items.length && items[0].y;
$: onScroll;
const setActiveLine=y=> activeline=y;
</script>

<VirtualScroll start={-1}  keeps={40} data={items} key="y"  height="calc(100% - 1.5em)"
    let:data >
    <div  on:click={()=>setActiveLine(data.y) }>
    <span class='excerptlinesep'></span>
    {#if typeof ptk.getLine(data.y)=='undefined'}
        {#await ptk.prefetchLines(data.y,2)}
            <ExcerptLine {side} {ptk} {...data}  loading={true}/>
        {:then}
            <ExcerptLine {side} {ptk} {...data} {parallels} activeline={activeline==data.y} hits={ptk.hitPos(data.y,postings,phrases)} />
        {/await}
    {:else}
        <ExcerptLine {side}  {ptk} {...data} {parallels}  activeline={activeline==data.y} hits={ptk.hitPos(data.y,postings,phrases)}/>
    {/if}
    </div>
</VirtualScroll>

<style>
    .excerptlinesep {display:block;height:1px;background-color: gray;}
</style>