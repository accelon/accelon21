<script>
export let count=0;
export let showheading;
const toggleshow=()=>{
    showheading=!showheading;
}
</script>
<span class=bookcount class:showheading on:click={toggleshow}>{count}</span>
<style>
    .showheading {background:var(--highlight)}
</style>