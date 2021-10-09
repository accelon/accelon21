<script>
    export let ptk
    const inputkeyup=()=>{

    }
    let cursorword='';
</script>
<input class="tofind" bind:value={cursorword}
 title='↑Prev  ↓Next  ⮠ Search' on:keyup={inputkeyup} />

<style>
    .tofind {width:6em}
</style>