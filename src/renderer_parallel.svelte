<script>
import { onMount } from "svelte";
export let loc;
export let ptk;
export let caption;
let showing=false;
let [y0] = ptk.getPageRange( ptk.pageLoc(loc));
const dy=ptk.dyOf(loc);
let text='',y;
onMount(async ()=>{
    [y,text]=(await ptk.readLines(y0+dy+1,1))[0]
});
$:console.log(ptk.getLine(y0+dy+1))
</script>
<span class='btnparallel clickable' on:click={()=>showing=!showing} >{caption}</span>
{#if showing}
<span>{text}</span>
{/if}

