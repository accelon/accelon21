<script>
import Buttons from '../comps/buttons.svelte';
import {filterings} from '../js/filterstore.js';
export let options=[]; //from pitaka.json
export let ptk,caption,filter,attrname;
$: ptk,caption,filter;
let values=[];
const update=vals=>{
    if (vals.length==options.length) {//
        filterings.set([]);// all items are selected, clear the filterings
        return;
    }
    const lbl=ptk.getHeadingLabel();
    const filtered=lbl.findAttrVal(attrname,vals);
    filterings.set(filtered);
}
$: update(values);
const items=options.map(it=>{return {name:it[0],label:it[1]} });
</script>
<Buttons onoff={true} allon={true} type="checkbox" bind:values {items}/>
