<script>
import VirtualScroll from './3rdparty/virtualscroll'
import InputNumber from './comps/inputnumber.svelte';
import Keywords from './comps/keywords.svelte';
import {_,tosim} from './js/store.js'
export let items;
export let ptk;
export let fullname=true;

const getTitle=text=>{
    return _(fullname?text.replace(/\|.+/,''):text.replace(/.+\|/,''),$tosim);
}
const getJuan=bk=>{
   return ptk&&ptk.childCount(bk)
}
const setJuan=(id,juan)=>{
    console.log(id,juan)
}
const setKeyword=()=>{

}
</script>

<VirtualScroll start={-1}  keeps={40} data={$items} key="key" let:data >
<div>
    <span class="bookid">{data.id}</span>

    <span class="tocitem">{getTitle(data.text)}</span>
    
    {#if getJuan(data.id)<6}
        {#each Array(getJuan(data.id)-1) as j,idx }
        <span class="clickable" on:click={()=>setJuan(data.id,idx)}> {idx+2} </span>
        {/each}
        {:else}
        <InputNumber on:change={(value)=>setJuan(data.id,value)} value={getJuan(data.id)} min={1}/>
    {/if}
    {#each data.keywords as [label,keyid]}
    <t on:click={setKeyword} {label} class={"clickable "+ label}>
        <Keywords {ptk} {label} {keyid}/>
    </t>
    {/each}
</div>
</VirtualScroll>