<script>
import {getContext} from 'svelte'
import StateBtn from '../comps/statebutton.svelte';
import {filterEntry,allEntry} from 'pitaka/search';
import {debounce} from 'pitaka/utils';
import {_} from '../js/store.js';
export let store;
export let filter;
export let ptk;
export let name;
let tofind=$store.opts.tofind||'';
let mode=$store.opts.mode||0;

$: filter;
let history=["三","如來"];
const {names,caption} =ptk.getLabel(name);

const inputSearch=(m)=>{
    if (!tofind) {
        store.set(Object.assign($store,{ opts:{mode,tofind:''},res:allEntry(names)}))
        return;
    }
    tofind=tofind.trim();
    const res=filterEntry(tofind, names, m);
    store.set(Object.assign($store,{opts:{mode,tofind},res}));
}
$: inputSearch(mode);
const input=debounce(()=>{
    // if (tofind.trim()){
        inputSearch(mode);
    // } else {
        // matchCursorWord($cursor.ori)   
    // }
},500);

const matchmodestyles=()=>{
    const styles={m0:'var(--highlight)'};
    for (let i=0;i<3;i++) {
        styles['m'+i]= (mode==i)?'var(--highlight)':'auto';
    }
    return styles;
}
const goback=idx=>{
    tofind=history[idx];
    inputSearch(mode);
    // matchCursorWord(cw);
}
const states={0:'begin',1:'middle','2':'end'};
</script>
<div class="searchbox">
    <div class="inputbox">
        <StateBtn bind:selectedIndex={mode}  styles={matchmodestyles(mode)} 
         caption="matchmode" {states} />
        <input class="tofind" bind:value={tofind} on:input={input} placeholder={_(caption)}/>
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