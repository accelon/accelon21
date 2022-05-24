<script>
import { getContext} from 'svelte';
import {slide} from 'svelte/transition';
import { get} from 'svelte/store';
export let text='',side=0,loc='',ptk=null;
export let from=0,to=0,y0=0;
export let key=0,renderer=null,usernotes=null,linetofind='',bookmarks=null;
export let master,activeline,lang
$:text,side,loc,key,renderer,usernotes,linetofind,bookmarks,master,activeline,lang;

let _from=from,_to=to;
const viewitems=getContext('viewitems');

const moreupper=()=>{
    const items=get(viewitems);
    let at=items.findIndex( it=>it.key==y0+_from-1); //key is 1 based
    if (at==-1) return;
    at++;
    let chars=0;
    while (_from>1 && _from<_to-1) {
        const key=y0+_from;
        items.splice(at,0, {key,transition:slide});
        _from++;
        at++;
        chars+=ptk.getLine(key).length;
        if (chars>MORECHAR) break;
    }
    viewitems.set(items);
}
const MORECHAR=50;
const morelower=()=>{
    const items=get(viewitems);
    const at=items.findIndex( it=>it.key==y0+_to); //key is 1 based
    if (at==-1) return;
    let chars=0;
    while (_to-1>_from) {
        const key=y0+_to-1;
        items.splice(at,0, {key,transition:slide});
        _to--;
        chars+=ptk.getLine(key).length;
        if (chars>MORECHAR) break;
    }
    viewitems.set(items);
}
</script>
{#if _to>_from+1}
<div class="collapse">
    {#if _from>1&&_to-2>_from}<span class="clickable moreline" on:click={moreupper}>:{_from}</span> ……{/if} 
    <span class="clickable moreline" on:click={morelower}>:{_to-1}</span>
<slot></slot>
</div>
{/if}
<style>
    .moreline {padding-left : 0.5em;padding-right:0.5em}
    .collapse {background:var(--collapsebackground);padding-left:1em;-webkit-user-select: none; }
</style>