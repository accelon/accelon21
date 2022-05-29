<script>
import {_} from '../js/store.js'
export let query='';
export let criterion;
export let method;
export let update;
export let component;
export let lang;
$: component,lang;
$: update ( method,query)
</script>
<span>{_(lang,criterion.label.caption)}<input bind:value={query}/></span>