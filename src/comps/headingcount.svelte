<script>
import {_} from '../js/store.js'
export let count=0;
export let showheading=true;
const toggleshow=()=>{
    showheading=!showheading;
}
$: showexcerpt=!showheading;
</script>
<span class=bookcount class:showexcerpt on:click={toggleshow} title={_("符合篇數 Article Count")}>{count}</span>
<style>
    .showexcerpt {background:var(--highlight)}
</style>