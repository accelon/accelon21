<script>
import VirtualScroll from './3rdparty/virtualscroll'
import ExcerptLine from './render_excerpt.svelte';
export let items=[];
export let ptk;
export let side;
export let phrases=[];
export let postings=[];
export let onScroll;
$: onScroll;
</script>

<VirtualScroll start={-1}  keeps={40} data={items} key="y"  height="calc(100% - 1.5em)"
    let:data >
    <span class='excerptlinesep'></span>
    {#if typeof ptk.getLine(data.y)=='undefined'}
        {#await ptk.prefetchLines(data.y,2)}
            <ExcerptLine {side} {ptk} {...data}  loading={true}/>
        {:then}
            <ExcerptLine {side} {ptk} {...data} hits={ptk.hitPos(data.y,postings,phrases)} />
        {/await}
    {:else}
        <ExcerptLine {side}  {ptk} {...data} hits={ptk.hitPos(data.y,postings,phrases)}/>
    {/if}
</VirtualScroll>
<style>
    .excerptlinesep {display:block;height:1px;background-color: gray;}
</style>