<script>
import {debounce} from 'pitaka/utils'
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import {_,tosim} from './js/store.js';
import {bookqueryhistory,QUERYSEP} from './js/query.js';
import {validateTofind } from 'pitaka/fulltext';
import {activebooktofind, addbookqueryhistory} from "./js/query.js";
export let query='';
export let ptk;

$: keywords=(ptk&&ptk.getLabel&&ptk.getLabel('bk')&&Object.keys(ptk.getLabel('bk').keywords))||[] ;
export let setBookname=null;
export let setKeyword=null;

$: qhis=$bookqueryhistory.split(QUERYSEP);
const onBookname=()=>{
    $activebooktofind=validateTofind(query);
    setBookname&&setBookname($activebooktofind);
}
const onKeyword=(label,value)=>{
    setKeyword&&setKeyword(label,value);
}
let sLabel,selected;
$: if(ptk &&ptk.getLabel) sLabel= ptk.getLabel(selected) ||null;
const getKeyItems=keys=>$tosim?keys.map(key=>_(key,$tosim)):keys;
</script>
{#key $tosim}
<select bind:value={selected}>
<option value="bk">{_("書名")}</option>
{#each keywords as label}
<option value={label}>{ptk.getLabel(label).caption}</option>
{/each}
</select>
{#if sLabel}
{#if selected==='bk'}
<AutoComplete placeholder={_(sLabel.caption)}
 bind:text={query} items={qhis} onInput={debounce(onBookname,250)} />
{:else}
<AutoComplete inputId={"autocomplete_"+sLabel} items={getKeyItems(sLabel.keys)} 
placeholder={selected!==sLabel.name?_(sLabel.caption):''} 
onChange={value=>onKeyword(sLabel,value)}/>
{/if}
{/if}
{/key}
