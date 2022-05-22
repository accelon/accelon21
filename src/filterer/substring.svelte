<script>
export let query;
export let criterion;
export let method;
export let update;
export let component;

$: component;
$: update ( method,query)
</script>
<span><input bind:value={query}/></span>