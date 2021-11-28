<script>
import {debounce} from 'pitaka/utils'
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import {_,tosim} from './js/store.js';
import {bookqueryhistory,QUERYSEP} from './js/query.js';
import {validateTofind } from 'pitaka/fulltext';
import {activebooktofind, addbookqueryhistory} from "./js/query.js";
export let keylabel='';
export let keyvalue;
export let ptk;
let cluster=ptk.header.cluster;
$: keywords=(ptk.getLabel&&ptk.getClusterLabel()&&Object.keys(ptk.getClusterLabel().keywords||{}))||[] ;
export let onKeyword=null;
let clinput=keylabel===cluster?keyvalue:'';
$: qhis=$bookqueryhistory.split(QUERYSEP);
const onClustername=()=>{
    onKeyvalue(cluster,clinput);
}
const onKeyvalue=(label,val)=>{
    if (typeof val=='undefined') return;
    val=validateTofind(val.key?val.key:val);
    onKeyword&&onKeyword(label,val);
}
const clearValue=()=>{
    keyvalue='';
    setTimeout(()=>{
        document.getElementById("autoinput").focus();
    },30);
}

$: items=(keylabel&&keylabel!==ptk.header.cluster)?ptk.getLabel(keylabel)&&ptk.getLabel(keylabel).keys.map( (key,id)=>{ return { id, key,name:(tosim?_(key,tosim):key)+' '+ptk.getLabel(keylabel).positionOf(key).length }} ):[];
</script>
{#key $tosim}
<select on:change={clearValue} bind:value={keylabel}>
<option value={ptk.header.cluster}>{ptk.getClusterLabel().caption}</option>
{#each keywords as label}
<option value={label}>{ptk.getLabel(label).caption}</option>
{/each}
</select>
{#if keylabel===ptk.header.cluster}
<AutoComplete inputId="autoinput" bind:text={clinput} items={qhis} onChange={onClustername} onInput={debounce(onClustername,200)} />
{:else if (keylabel && ptk)}
<AutoComplete inputId="autoinput" {items}
labelFieldName="name" text={_(keyvalue,$tosim)}
onChange={ obj=>onKeyvalue(keylabel,obj)}/>
{/if}
{/key}
