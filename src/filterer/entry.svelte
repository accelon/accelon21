<script>
import {getContext} from 'svelte'
import StateBtn from '../comps/statebutton.svelte';
import {_} from '../js/store.js';
import {isSimpleRegEx} from 'pitaka/utils'
export let query;
export let update;
export let criterion;
export let method;
export let component;
export let lang;
$: component,lang;
let value='';
let mode=0;
if (query[0]=='.' && query[query.length-1]=='.') {
    mode=1;
} else if (query[query.length-1]=='$') {
    mode=2;
}
value=query.replace(/^\^/,"").replace(/^\.+/,"").replace(/\.+$/,"").replace(/\$$/,"");

let history=[];

const queryWithMode=(value,mode)=>{
    if (mode==0 && !(isSimpleRegEx(value))) return '^'+value;
    else if (mode==2) return value+'$';
    else if (mode==1 && value.length) return '.'+value+'.';//middle
    else return value;
}
$: update ( method,queryWithMode(value,mode))
const matchmodestyles=()=>{
    const styles={m0:'var(--highlight)'};
    for (let i=0;i<3;i++) {
        styles['m'+i]= (mode==i)?'var(--highlight)':'auto';
    }
    return styles;
}

const goback=idx=>{
    query=history[idx];
    // matchCursorWord(cw);
}
const states={0:'begin',1:'middle',2:'end'};
</script>
<div class="searchbox">
    <div class="inputbox">
        <StateBtn bind:selectedIndex={mode}  styles={matchmodestyles(mode)} 
         caption="matchmode" {states} />
        <input class="tofind" bind:value placeholder={_(criterion.label.caption)}/>
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