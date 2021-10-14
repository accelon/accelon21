<script>
import { useBasket} from "pitaka/basket";
import ForeignLink from './foreignlink.svelte';

export let counts={} , loc='', ptk;
const gengroups=Counts=>{
    const out=[];
    for (let name in Counts) {
        const ptk=useBasket(name);
        out.push({name,title:ptk.header.title,count:Counts[name]||0})
    }
    return out;
}
$: groups=gengroups(counts);
let showing='';
let srclinks=[];
const toggleShow=(ptkname)=>{
    srclinks=[];

    if (showing==ptkname) {
        showing='';
        return;
    }

    const srcptk=useBasket(ptkname);
    const transclusions=srcptk.findTransclusion(ptk,loc);

    const out=[];
    for (let y in transclusions) {
        out.push(...transclusions[y]);
    }
    if (out.length) showing=ptkname;
    srclinks=out.map(it=>[it[1],srcptk]);   
}
</script>
{#each groups as g}
{#if g.count}<span class="count" class:showing ptk={g.name} title={g.title} on:click={()=>toggleShow(g.name)}>
{g.count}
</span>
{#each srclinks as link}<ForeignLink from={ptk} ptk={link[1]} link={link[0]}/>{/each}
{/if}
{/each}

<style>
    .showing {color:HighlightText;
        border-radius: 5px; 
        background:Highlight;font-weight: bold;}
    .count {font-size:75%;cursor:pointer}
    .count:hover {color:var(--highlight)}
</style>
