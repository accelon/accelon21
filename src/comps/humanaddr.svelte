<script>
import {useBasket,PATHSEP} from 'pitaka'
import {parseAddress} from 'pitaka/offtext';
import {_,tosim} from '../js/store.js';
export let onclick=null;
export let caption='';
export let showjuan=false;
export let address='';
export let loc=''
export let locOnly=false; //no pitaka name
export let c=''
export let ptk=null;
const click=(evt)=>{
    onclick(evt)
}
if (address) {
    let basket='',ptr;
    ptr=parseAddress(address);
    basket=ptr.basket;
    if (basket) {
        ptk=useBasket(basket);
        if (ptr) {
            loc=ptr.loc;
        }
    }
}
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc,locOnly))||[]; 
</script>
<span title={address}>
<span class='clickable' on:click={click}>
{#if toctree.length}
{#each toctree as tocnode,idx}<span>{idx?PATHSEP:''}{_(tocnode.name,$tosim)}</span>{/each}<span>{c&&showjuan?PATHSEP+c:''}{_(caption,$tosim)}</span>
{:else}
{_(ptk,$tosim)}
{/if}
</span>
</span>