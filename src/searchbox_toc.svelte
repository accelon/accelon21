<script>
import {debounce} from 'pitaka/utils'
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import {_,tosim} from './js/store.js';
import {bookqueryhistory,QUERYSEP} from './js/query.js';
import {validateTofind } from 'pitaka/fulltext';
import {activebooktofind, addbookqueryhistory} from "./js/query.js";
export let keylabel='';
export let keyvalue='';
export let ptk;
let chunk=ptk.header.chunk;
$: keywords=(ptk.getLabel&&ptk.getChunkLabel()&&Object.keys(ptk.getChunkLabel().keywords||{}))||[] ;
export let onKeyword=null;
let clinput=keylabel===chunk?keyvalue:'';
$: qhis=$bookqueryhistory.split(QUERYSEP);
const onChunkname=()=>{
    onKeyvalue(chunk,clinput);
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

$: items=(keylabel&&keylabel!==ptk.header.chunk)?ptk.getLabel(keylabel)&&ptk.getLabel(keylabel).keys.map( (key,id)=>{ return { id, key,name:(tosim?_(key,tosim):key)+' '+ptk.getLabel(keylabel).positionOf(key).length }} ):[];
</script>
{#key $tosim}
<select on:change={clearValue} bind:value={keylabel}>
<option value={ptk.header.chunk}>{ptk.getChunkLabel().caption}</option>
{#each keywords as label}
<option value={label}>{ptk.getLabel(label).caption}</option>
{/each}
</select>
{#if keylabel===ptk.header.chunk}
<AutoComplete inputId="autoinput" bind:text={clinput} items={qhis} onChange={onChunkname} onInput={debounce(onChunkname,200)} />
{:else if (keylabel && ptk)}
<AutoComplete inputId="autoinput" {items}
labelFieldName="name" text={_(keyvalue,$tosim)}
onChange={ obj=>onKeyvalue(keylabel,obj)}/>
{/if}
{/key}
