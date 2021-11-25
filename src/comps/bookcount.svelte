<script>
export let count=0;
export let showbooklist;
const toggleshow=()=>{
    showbooklist=!showbooklist;
}
</script>
<span class=bookcount class:showbooklist on:click={toggleshow}>{count}</span>
<style>
    .showbooklist {background:var(--highlight)}
</style>