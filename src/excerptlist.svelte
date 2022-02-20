<script>
import VirtualScroll from './3rdparty/virtualscroll'
import ExcerptLine from './render_excerpt.svelte';
export let items=[];
export let ptk;
</script>

<VirtualScroll start={-1}  keeps={40} data={items} key="key"  height="calc(100% - 1.5em)"
    let:data >
    <span class='excerptlinesep'></span>
    {#if typeof ptk.getLine(data.y)=='undefined'}
        {#await ptk.prefetchLines(data.y,2)}
            <ExcerptLine {ptk} {...data} loading={true}/>
        {:then}
            <ExcerptLine {ptk} {...data}/>
        {/await}
    {:else}
        <ExcerptLine {ptk} {...data}/>
    {/if}
</VirtualScroll>
<style>
    .excerptlinesep {display:block;height:1px;background-color: gray;}
</style>