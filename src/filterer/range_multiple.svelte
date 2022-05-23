<script>
import Buttons from '../comps/buttons.svelte';
export let query='';
export let criterion;
export let method;
export let update;
export let component;
$: component;
let values=query.split(',').map(it=>parseInt(it)).filter(it=>!isNaN(it));
$: update(method, ((values.length===items.length)?'':values.join(',')  ));
$: items= criterion.label.names.map( (it,idx)=>{ return {name:idx+1,label:it }});

</script>
{criterion.label.caption}:<Buttons allon={true} type="checkbox" bind:values {items}/>