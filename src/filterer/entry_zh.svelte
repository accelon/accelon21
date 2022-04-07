<script>
import StateBtn from '../comps/statebutton.svelte';
import {filterEntry,allEntry} from 'pitaka/search';
import {debounce} from 'pitaka/utils';
import {headings} from '../js/filterstore.js';
import heading from '../js/heading';
export let filter;
export let ptk;
export let name;
let tofind='';
$: filter;
let history=["三","如來"];
const {names} =ptk.getLabel(name);
let mode=0;
const inputSearch=(m)=>{
    if (!tofind) {
        headings.set(allEntry(names))
        return;
    }
    tofind=tofind.trim();
    const res=filterEntry(tofind, names, m);
    headings.set(res);
}
$: inputSearch(mode);
const input=debounce(()=>{
    // if (tofind.trim()){
        inputSearch(mode);
    // } else {
        // matchCursorWord($cursor.ori)   
    // }
},500);
let matchmodestyles={m0:'var(--highlight)'};
const changemode=()=>{
    mode++;
    if (mode>2) mode=0;
    for (let i=0;i<3;i++) {
        matchmodestyles['m'+i]= (mode==i)?'var(--highlight)':'auto';
    }
}
const goback=idx=>{
    tofind=history[idx];
    inputSearch(mode);
    // matchCursorWord(cw);
}

</script>
<div class="searchbox">
    <div class="inputbox">
        <StateBtn onclick={changemode} styles={matchmodestyles} 
        forceupdate={mode} caption="matchmode"/>
        <input class="tofind" bind:value={tofind} on:input={input}/>
        <div class="history">
            {#each history.slice(0,3) as hitem,idx (idx)}
            <span class="historyitem" on:click={()=>goback(idx)}>{hitem} </span>
            {/each}
        </div>
    </div>
</div>

<style>
    .tofind {width:80%}
    .inputbox{padding-top:0.5em;pointer-events:all;}
    .historyitem {right:10px;pointer-events:all;}
    .history {width:100%;margin-right:1em}
    .historyitem:hover{color:var(--highlight)}
</style>