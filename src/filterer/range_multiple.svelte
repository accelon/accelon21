<script>
import Buttons from '../comps/buttons.svelte';
import {_,tosim} from '../js/store';
export let query='';
export let criterion;
export let method;
export let update;
export let component,lang;
$: component,lang;
let values=query.split(',').map(it=>parseInt(it)).filter(it=>!isNaN(it));
$: update(method, ((values.length===items.length)?'':values.join(',')  ));
$: items= criterion.label.names.map( (it,idx)=>{ return {name:idx+1,label:_(lang,it,$tosim) }});

</script>
{criterion.label.caption}:<Buttons allon={true} type="checkbox" bind:values {items}/>