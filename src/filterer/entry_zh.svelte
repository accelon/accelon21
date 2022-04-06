<script>
import StateBtn from '../comps/statebutton.svelte';
import {filterEntry} from 'pitaka/search';
import {debounce} from 'pitaka/utils';
import { getContext } from 'svelte';
const headingitems=getContext('headings');
export let ptk;
export let name;
let history=["三","如來"];
const {names,linepos,idarr} =ptk.getLabel(name);
let items=[],mode=0;
const inputSearch=(m)=>{
    if (!tofind)return;
    tofind=tofind.trim();
    const res=filterEntry(tofind, names, m);
    //{key:i, y0,id,text, keywords });
    items=res.map((it,idx)=>{
        const y0=linepos[it];
        return {key:it,id:idarr[it], text:names[it], y0};
    });
    headingitems.set(items);
}
$: inputSearch(mode,tofind);
const input=debounce(()=>{
    if (tofind.trim()){
        inputSearch(mode);
    } else {
        // matchCursorWord($cursor.ori)   
    }
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
    // matchCursorWord(cw);
}
let tofind='';
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