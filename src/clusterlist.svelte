<script>
import VirtualScroll from './3rdparty/virtualscroll'
import InputNumber from './comps/inputnumber.svelte';
import Keywords from './comps/keywords.svelte';
import {_,tosim} from './js/store.js'
export let items;
export let ptk;
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
const setJuan=(id,juan)=>{
    console.log(id,juan)
}
const goitem=(id)=>{
    console.log(id)
}
</script>

<VirtualScroll start={-1}  keeps={30} data={$items} key="key" let:data >
<div>
    <span class="bookid">{data.id}</span>
    <span class="tocitem" on:click={()=>goitem(data.id)}>{getTitle(data.text)}</span>
    {#if getJuan(data.id)&&getJuan(data.id)<6 && data.id}
        {#each Array(getJuan(data.id)-1) as j,idx }
        <span class="clickable" on:click={()=>setJuan(data.id,idx)}> {idx+2} </span>
        {/each}
        {:else if getJuan(data.id)}
        <InputNumber on:change={(value)=>setJuan(data.id,value)} value={getJuan(data.id)} min={1}/>
    {/if}
    {#each data.keywords as [label,keyid]}
    <t {label} class={"clickable "+ label}>
        <Keywords {onKeyword} {ptk} {label} {keyid}/>
    </t>
    {/each}
</div>
</VirtualScroll>