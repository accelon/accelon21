<script>
import {getSide,gotab ,resettab,removetab,inserttab, addtab,selectorShown} from './js/addresses.js'
import {copyAddress,copiedAddress} from './js/address.js'
import Btn from './button.svelte';
import { getContext } from 'svelte';

export let tabid;
const side=getSide();
const needaltkey=(side=='a'?'+Alt':'')
const keyhint="Ctrl"+ + "+1...9";
const addresses=getContext('addresses');
const reset=evt=>{
    const idx=parseInt(evt.target.attributes.idx.value);
    resettab(idx,addresses);
    evt.cancelBubble=true;
}
const remove=evt=>{
    const idx=parseInt(evt.target.attributes.idx.value);
    removetab(idx,addresses);
    evt.cancelBubble=true;
}

const cloneTab=evt=>{
    let ele=evt.target;
    if (!ele.attributes.at) ele=ele.parentElement;
    const at=parseInt(ele.attributes.at.value);
    const address=ele.attributes.address.value;
    inserttab(address,at,addresses);
    evt.cancelBubble=true;
}
</script>
<span title={keyhint} class="tabid" 
on:click={()=>$selectorShown=!$selectorShown}>{tabid+1}</span>
{#if $selectorShown}
<div class="pulldown">
    {#each $addresses as address,idx}
    {#if tabid===idx } 
    <div class="address" >
        <span class="tabid active">{idx+1}</span>
        <span class=addr on:click={()=>$selectorShown=false } >{address}</span>
        {#if address===$copiedAddress}
            <span title="克隆此頁 clone" on:click={cloneTab} at={idx+1} {address} class="addtab">
                <span class="tabid">{idx+2}</span>+</span>
        {:else if address!=='/'}
            <Btn title="复制位址 copyaddress" icon="copyaddress" onclick={()=>copyAddress(address)}/>
        {/if}
    </div>
    {:else}
    <div class="address" on:click={()=>gotab(idx,addresses)} >
        {#if address==='/'}
        <span title="刪除 remove" class="tabid removetabid" on:click={remove} {idx}>{idx+1}</span>
        {:else}
        <span title="重置 reset" class="tabid resettabid" on:click={reset} {idx}>{idx+1}</span>
        {/if}
        <span class="addr" >{address}</span>
    </div>
    {/if}
    {/each}
    <span title={"Ctrl"+needaltkey+"+0"} class="addtab" 
    on:click={()=>addtab($copiedAddress,addresses,true)}>{$addresses.length+1}+ 
    <span>{$copiedAddress}</span></span>
</div>
{/if}
<style>
    .active {color:var(--highlight)}
    .pulldown {position:absolute;background:var(--menubackground);
        box-shadow: 0 0 10px ;max-height: 15em;overflow-y:scroll}
    .tabid {padding-left:3px;padding-right:3px;
        font-weight: bolder;cursor:pointer;
        font-family: 'Courier New', Courier, monospace;
        border:1px solid var(--button-selected)}
    
    .removetabid:hover {text-decoration: line-through;background:red}
    .resettabid:hover {text-decoration: line-through;}
    .addr:hover{color:var(--highlight)}
    .addtab{padding-left:3px;padding-right:3px;border:1px solid rgba(0,0,0,0)}
    .addtab:hover{cursor:pointer;color:var(--highlight)}
</style>