<script>
export let query='';
export let criterion;
export let method;
export let update;
export let component;

$: component;
$: update ( method,query)
</script>
<span>{criterion.label.caption}<input bind:value={query}/></span>