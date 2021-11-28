<script>
export let count=0;
export let showcluster;
const toggleshow=()=>{
    showcluster=!showcluster;
}
</script>
<span class=bookcount class:showcluster on:click={toggleshow}>{count}</span>
<style>
    .showcluster {background:var(--highlight)}
</style>