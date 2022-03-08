<script>
import {  NAMESPACESEP, pool} from 'pitaka';
import {_,tosim} from './js/store.js'
import {activetofind,runquerycount} from './js/query.js'
import { get, writable } from 'svelte/store';
import { settab } from './js/addresses';
import QueryResult from './queryresult.svelte';
import QuickPointer from './quickpointer.svelte'
export let side=0;

$: pitakas=pool.getAll().filter(it=>it.name!=='pitaka');

$: if (pitakas) for (let i=0;i<pitakas.length;i++) {
    if (!pitakas[i].querystore) pitakas[i].querystore=writable({});
}
const getItems=(ptk,tofind,rc)=>{
    return rc?get(ptk.querystore)[tofind] ||[]:[] 
};
const visit=homepage=>{
    window.open(homepage||'https://accelon.github.io','_new');
}
let isvalid={};
</script>
{#each pitakas as ptk}
<div class="pitaka">
    <span class="clickable name" on:click={()=>visit(ptk.header.homepage)}>{ptk.name}</span>
    <span class="title" on:click={evt=>settab(side,ptk.name+NAMESPACESEP)}>
    {_(ptk.header.title,$tosim)}</span>
    <QueryResult items={getItems(ptk,$activetofind,$runquerycount)} />
    <div class="details">
    {#if !isvalid[ptk.name]}
        <span class="labeltext" label={_(ptk.chunkCount()?'冊':'條',$tosim)}>{ptk.contentCount()}</span>
        {#if ptk.chunkCount()}<span class="labeltext" label={_('標題',$tosim)}>{ptk.chunkCount()}</span>{/if}
        <span class="labeltext" label='文段'>{ptk.header.lastTextLine}</span>
        <span class="labeltext" label='建立'>{ptk.header.buildtime.replace(/T.+$/,'')}</span>
        {#if ptk.header.description}<br/><span class="labeltext" label={_('說明',$tosim)}>{_(ptk.header.description,$tosim)}</span>{/if}
    {/if}
    <span class='separator'></span>
    </div>
</div>
{/each}
