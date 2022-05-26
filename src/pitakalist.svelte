<script>
import {  NAMESPACESEP, pool} from 'pitaka';
import {_,tosim,searchstore} from './js/store.js'
import {activetofind,runquerycount} from './js/query.js'
import { get, writable } from 'svelte/store';
import { settab } from './js/addresses';
import QueryResult from './queryresult.svelte';
import QuickPointer from './quickpointer.svelte'
export let side=0;
import VirtualScroll from './3rdparty/virtualscroll'

$: pitakas=pool.getAll().filter(it=>it.name!=='pitaka').map((ptk,idx)=>{return {key:idx,ptk}});

const getItems=(ptk,tofind,rc)=>{
    return rc?get(searchstore)[ptk.name+':'+tofind] ||[]:[] 
};
const visit=homepage=>{
    window.open(homepage||'https://accelon.github.io','_new');
}
const getAlignment=ptk=>{
    return (ptk.header.alignment.includes(ptk.header.name)?'':ptk.header.alignment)
}
let isvalid={};
const openPitaka=(ptk)=>{
    ptk.resetCriteria();
    settab(side,ptk.name+NAMESPACESEP)
}
</script>

<VirtualScroll  start={-1} 
    keeps={20} data={pitakas} key="key" height="calc(100% - 1.5em)"  let:data >
<div class="pitaka">
    <span class="clickable name" on:click={()=>visit(data.ptk.header.homepage)}>{data.ptk.name}🏠</span>
    <span class="clickable title" on:click={()=>openPitaka(data.ptk)}>
        {_("",data.ptk.header.title,$tosim)}</span>
    <QueryResult items={getItems(data.ptk,$activetofind,$runquerycount)} {side}/>
    <div class="details">
    {#if !isvalid[data.ptk.name]}
        <span class="labeltext" label={_('',data.ptk.chunkCount()?'冊':'條',$tosim)}>{data.ptk.contentCount()}</span>
        {#if data.ptk.chunkCount()}<span class="labeltext" label={_('','標題',$tosim)}>{data.ptk.chunkCount()}</span>{/if}
        <span class="labeltext" label='文段'>{data.ptk.header.lastTextLine}</span>
        <span class="labeltext" label='建立'>{data.ptk.header.buildtime.replace(/T.+$/,'')}</span>
        {#if data.ptk.header.description}<br/><span class="labeltext" label={_('','說明',$tosim)}>{_('',data.ptk.header.description,$tosim)}</span>{/if}

    {/if}

    <span class='separator'></span>
    </div>
</div>
</VirtualScroll>

