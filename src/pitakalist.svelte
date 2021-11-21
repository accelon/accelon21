<script>
import { PATHSEP, pool} from 'pitaka';
import {_,tosim} from './js/store.js'
import {activetofind,runquerycount,} from './js/query.js'
import { getContext } from 'svelte';
import { get, writable } from 'svelte/store';
import { settab } from './js/addresses';
import QueryResult from './queryresult.svelte';

const addresses=getContext('addresses');
$: pitakas=pool.getAll();

$: if (pitakas) for (let i=0;i<pitakas.length;i++) {
    if (!pitakas[i].querystore) pitakas[i].querystore=writable({});
}
const getItems=(ptk,tofind,rc)=>{
    return rc?get(ptk.querystore)[tofind] ||[]:[] 
};
const visit=homepage=>{
    window.open(homepage||'https://accelon.github.io','_new');
}
</script>
{#each pitakas as ptk}
<div class="pitaka">
    <span class='separator'></span>
    <span class="clickable name" on:click={()=>visit(ptk.header.homepage)}>{ptk.name}</span>
    <span class="title" on:click={evt=>settab(addresses,PATHSEP+ptk.name)}>
    {_(ptk.header.title,$tosim)}</span>
    <QueryResult items={getItems(ptk,$activetofind,$runquerycount)} />
    <div class="details">
        <span class="labeltext" label={_(ptk.chapterCount()?'冊':'條',$tosim)}>{ptk.contentCount()}</span>
        {#if ptk.chapterCount()}<span class="labeltext" label='卷'>{ptk.chapterCount()}</span>{/if}
        <span class="labeltext" label='段'>{ptk.header.lastTextLine}</span>
        <span class="labeltext" label='建立'>{ptk.header.buildtime.replace(/T.+$/,'')}</span>
        {#if ptk.header.description}<br/><span class="labeltext" label={_('說明',$tosim)}>{_(ptk.header.description,$tosim)}</span>{/if}

    </div>
</div>
{/each}

<a target="_new" href="https://accelon.github.io" class='endofcontent'>
    <img alt='' src="favicon.svg" width="20px" height="20px" /></a>
