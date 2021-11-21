<script>
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import { debounce } from 'pitaka/utils';
import { searchhelp } from './js/store.js';
import {validateTofind } from 'pitaka/fulltext';
import {queryhistory,activetofind,runquerycount,QUERYSEP} from './js/query.js'
import LoadingAnimation from './comps/loading.svelte'
import { get } from 'svelte/store';
import { tick } from 'svelte';
import Icons from './comps/icons.js';

export let pitakas=[];
let tasks=[];
let searching=false;

const searchpitaka=async ()=>{
    if (!tasks.length || !searching)return;
    const ptk=tasks[0];
    const queries=get(ptk.querystore);
    $activetofind=validateTofind(cursorword);
    if (!queries[cursorword]) {
        queries[cursorword]=await ptk.tryAllQuery(cursorword);
        ptk.querystore.set(queries);
        $runquerycount++;//force redraw of pitaka list
        await tick();
    }
    tasks.shift();
    if (tasks.length && searching) setTimeout(searchpitaka,10);
    else searching=false;
}
const searchall=()=>{
    if (!cursorword)return;
    tasks=[];
    tasks.push(...pitakas);
    searching=true;
    searchpitaka();
}
$: qhis=$queryhistory.split(QUERYSEP);

let cursorword='';
</script>
<span class={ $searchhelp?"showing":"notshowing"} 
on:click={()=>$searchhelp=!$searchhelp}>{@html Icons.search}</span>
<AutoComplete showClear={true} bind:text={cursorword}
items={qhis}  onInput={debounce(searchall,250)} onChange={searchall}/>

<span class="clickable" class:hidden={!searching} on:click={()=>searching=false}><LoadingAnimation/></span>
<style>
    .showing{fill:var(--highlight)}
    .notshowing{fill:var(--button-unselected)}
</style>