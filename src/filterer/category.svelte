<script>
import Buttons from '../comps/buttons.svelte';
export let options=[]; //from pitaka.json

let values=[];
const items=options.map(it=>{return {name:it[0],label:it[1]} });
</script>
<Buttons onoff={true} allon={true} type="checkbox" bind:values {items}/>
