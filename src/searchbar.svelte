<script>
import Btn from './comps/button.svelte'
const inputkeyup=()=>{

}
let cursorword='';
</script>

<input class="tofind" bind:value={cursorword}
 title='↑Prev  ↓Next  ⮠ Search' on:keyup={inputkeyup} />
 <Btn icon="search"/>
<style>
    .tofind {width:6em}
</style>