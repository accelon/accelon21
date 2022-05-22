<script>
import AutoComplete from './3rdparty/simpleautocomplete.svelte';
import { debounce } from 'pitaka/utils';
import { searchhelp,showFrontPage,searchstore} from './js/store.js';
import {validateTofind } from 'pitaka/search';
import {queryhistory,activetofind,runquerycount,QUERYSEP} from './js/query.js'
import LoadingAnimation from './comps/loading.svelte'
import { get } from 'svelte/store';
import { tick } from 'svelte';
import Btn from './comps/button.svelte';

export let side=0;
export let pitakas=[];
let tasks=[];
let searching=false;

const searchpitaka=async ()=>{
    if (!tasks.length || !searching)return;
    const ptk=tasks[0];
    const queries=get(searchstore);
    $activetofind=validateTofind(cursorword);
    const qkey=ptk.name+':'+cursorword;
    if (!queries[qkey]) {
        queries[qkey]=await ptk.runCriteria(cursorword);
        searchstore.set(queries);
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
$: qhis=queryhistory();

let cursorword='';
</script>

{#if side===0}<Btn icon="search" store={showFrontPage} />{/if}
<AutoComplete showClear={true} bind:text={cursorword}
items={qhis}  onInput={debounce(searchall,250)} onChange={searchall}/>

<span class="clickable" class:hidden={!searching} on:click={()=>searching=false}><LoadingAnimation/></span>
