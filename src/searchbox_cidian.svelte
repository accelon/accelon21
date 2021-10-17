<script>
import {cursor} from './js/store.js'
import StateBtn from './statebutton.svelte';
import {debounce} from 'pitaka/utils'
export let ptk;
let history=[];
let prevw='',prevcw='';
let mode=0;
let items=[];
const matchCursorWord=cw=>{
    const matches = ptk&&ptk.matchEntry(cw)||[]
    items=matches.map((i,idx)=>{
    const show=idx<2
        return {key:'cw'+i[0],show,idx,entry:i[1],from:i[2],to:i[3]} 
    });
    
    if (prevcw!==cw&&matches.length) { //do not change tofind when user input
        if (prevw&&prevw!==matches[0][1]) {
            history=history.filter(i=>i!==prevw);
            history.unshift(prevw);
            history=history;
        }
        tofind=matches[0][1];
        mode=0;
        prevw=tofind;
    }
    prevcw=cw;
}
$: matchCursorWord($cursor.ori)
$: inputSearch(mode);
const goback=idx=>{
    let cw=history.shift();
    while (idx>0) {
        cw=history.shift();
        idx--;
    }
    matchCursorWord(cw);
}
const inputSearch=(m)=>{
    tofind=tofind.trim();
    if (!tofind) return matchCursorWord($cursor.ori)
    const res=ptk.filterEntry(tofind, m);
    items=res.map((i,idx)=>{
        return {key:i[0] , idx, entry:i[1], from:i[2],to:i[3]}
    });
}

const input=debounce(()=>{
    if (tofind.trim()){
        inputSearch(mode);
    } else {
        matchCursorWord($cursor.ori)   
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
let tofind='';

</script>
<div class="searchbox">
    <div class="inputbox">
        <span class="matchcount">{items.length}</span>
        <StateBtn onclick={changemode} styles={matchmodestyles} 
        forceupdate={mode} caption="matchmode"/>
        <input class="tofind" bind:value={tofind} on:input={input}/>
        <span class="empty">　</span>
        <div class="history">
        {#each history.slice(0,3) as hitem,idx (idx)}
        <span class="historyitem" on:click={()=>goback(idx)}>{hitem} </span>
        {/each}
    </div>
    </div>
</div>
<style>
    .empty {width:1em}
    .searchbox {-webkit-user-select: none;z-index:10;pointer-events: none;}
    .inputbox{padding-top:0.5em; position:absolute;pointer-events:all;}
    .tofind {width:5em}
    .historyitem {right:10px;pointer-events:all;}
    .matchcount {font-size:75%;color:var(--button-selected)}
    .history {width:100%;margin-right:1em}
    .historyitem:hover{color:var(--highlight)}
</style>