<script>
import Buttons from '../comps/buttons.svelte';
export let options=[]; //from pitaka.json
export let ptk,caption,filter,attrname;
export let store;

$: ptk,caption,filter,attrname;
let values=$store.opts||[];
const update=vals=>{
    if (vals.length==options.length) {//
        store.set(Object.assign($store,{ops:[],res:[]}));// all items are selected, clear the filterings
        return;
    }
    const lbl=ptk.getHeadingLabel();
    const res=lbl.findAttrVal(attrname,vals);
    store.set(Object.assign( $store,{opts:values,res}));
}

$: update(values);
const items=options.map(it=>{return {name:it[0],label:it[1]} });
</script>
<Buttons allon={true} onoff={true} type="checkbox" bind:values {items}/>
