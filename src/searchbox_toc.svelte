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
$: keywords=(ptk&&ptk.getLabel&&ptk.getLabel('bk')&&Object.keys(ptk.getLabel('bk').keywords))||[] ;
export let onKeyword=null;
let bkinput=keylabel==='bk'?keyvalue:'';
$: qhis=$bookqueryhistory.split(QUERYSEP);
const onBookname=()=>{
    onKeyvalue('bk',bkinput);
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


$: items=(keylabel&&keylabel!=='bk')?ptk.getLabel(keylabel).keys.map( (key,id)=>{ return { id, key,name:tosim?_(key,tosim):key }} ):[];
</script>
{#key $tosim}
<select on:change={clearValue} bind:value={keylabel}>
<option value="bk">{_("書名")}</option>
{#each keywords as label}
<option value={label}>{ptk.getLabel(label).caption}</option>
{/each}
</select>
{#if keylabel==='bk'}
<AutoComplete inputId="autoinput" bind:text={bkinput} items={qhis} onChange={onBookname} onInput={debounce(onBookname,200)} />
{:else if (keylabel && ptk)}
<AutoComplete inputId="autoinput" {items}
labelFieldName="name" text={keyvalue}
onChange={ obj=>onKeyvalue(keylabel,obj)}/>
{/if}
{/key}
