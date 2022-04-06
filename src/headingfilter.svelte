<script>
    import {filterer} from "./js/store.js"
    export let ptk;

</script>
<div>
    {#each ptk.getHeadingFilters() as F}
    <svelte:component {...F} {ptk} 
        this={$filterer[F.filter]||$filterer.default}></svelte:component>
    {/each}
</div>