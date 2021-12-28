<script>
import { PATHSEP} from 'pitaka';
import VirtualScroll from './3rdparty/virtualscroll'
import InputNumber from './comps/inputnumber.svelte';
import Keywords from './comps/keywords.svelte';
import {_,tosim} from './js/store.js'
import { settab } from './js/addresses';
export let items;
export let ptk;
export let side=0;
export let fullname=true;
export let onKeyword;
const getTitle=text=>{
    text=text||''
    return _(fullname?text.replace(/\|.+/,''):text.replace(/.+\|/,''),$tosim);
}
const getJuan=cl=>{
   if (ptk.header.cluster==ptk.getTocTreeDef()[0]) {
       return ptk&&ptk.childCount(cl)
   } else {
       return 0;
   }
}

const setJuan=(y0,juan)=>{
    const loc=ptk.locOf(y0,true);
    settab(side,loc+PATHSEP+juan,{newtab:true});
}
const goitem=(y0)=>{
    const loc=ptk.locOf(y0,true);
    settab(side,loc,{newtab:true})
}
</script>

<VirtualScroll start={-1}  keeps={30} data={$items} key="key" let:data >
<div>
    <span class="bookid">{data.id}</span>
    <span class="tocitem" on:click={()=>goitem(data.y0)}>{getTitle(data.text)}</span>
    {#if getJuan(data.id)&&getJuan(data.id)<6 && data.id}
        {#each Array(getJuan(data.id)-1) as j,idx }
        <span class="clickable" on:click={()=>setJuan(data.y0,idx)}> {idx+2} </span>
        {/each}
        {:else if getJuan(data.id)}
        <InputNumber on:change={(value)=>setJuan(data.y0,value)} value={getJuan(data.id)} min={1}/>
    {/if}
    {#each data.keywords as [label,keyid]}
    <t {label} class={"clickable "+ label}>
        <Keywords {onKeyword} {ptk} {label} {keyid}/>
    </t>
    {/each}
</div>
</VirtualScroll>