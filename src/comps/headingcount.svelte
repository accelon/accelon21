<script>
export let count=0;
export let showheading=true;
const toggleshow=()=>{
    showheading=!showheading;
}
$: showexcerpt=!showheading;
</script>
<span class=bookcount class:showexcerpt on:click={toggleshow}>{count}</span>
<style>
    .showexcerpt {background:var(--highlight)}
</style>