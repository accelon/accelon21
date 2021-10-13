<script>
import { useBasket } from "pitaka/basket";

export let counts={};
const gengroups=C=>{
    const out=[];
    for (let i in C) {
        const ptk=useBasket(i);
        out.push([ptk.header.title,C[i]||0])
    }
    return out;
}
$: groups=gengroups(counts);

</script>
{#each groups as g}
{#if g[1]}<span class="count" title="{g[0]}">{g[1]}</span>{/if}
{/each}

<style>
    .count {font-size:75%;cursor:pointer}
    .count:hover {color:var(--highlight)}
</style>
