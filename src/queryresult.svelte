<script>
import {useBasket} from "pitaka"
import {stringifyAddress} from "pitaka/offtext";
import {_,tosim} from "./js/store.js";
import {addqueryhistory,activetofind} from "./js/query.js";
import {settab} from "./js/addresses.js";
export let items=[];
export let ptkname='';
export let side=0;
$: ptkname;
const openexcerpt=sres=>{
    const {basket,query,method}=sres;
    const ptk=useBasket(basket);
    ptk.resetCriteria();
    if (method=='*') {//full text search
        const addr=stringifyAddress({basket,'*':query})
        settab(side, addr,{newtab:true} )
    } else {
        const addr=stringifyAddress({basket,[method]:query});
        settab(side, addr,{newtab:true} )
    }
}
</script>
<span>
{#each items as sres}
{#if sres.count}
    <span class="clickable labeltext_query" on:click={()=>openexcerpt(sres)} label={_('',sres.caption,$tosim)} >
    {sres.count} </span>
{/if}
{/each}
</span>