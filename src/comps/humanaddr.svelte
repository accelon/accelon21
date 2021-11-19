<script>
import {useBasket,PATHSEP} from 'pitaka'
import {parsePointer} from 'pitaka/offtext';
import {_,tosim} from '../js/store.js';
export let onclick=null;
export let caption='';
export let showjuan=false;
export let address='';
export let loc=''
export let c=''
export let ptk=null;
const click=(evt)=>{
    onclick(evt)
}
if (address) {
    const ptr=parsePointer(address);
    ptk=useBasket(ptr.basket);    
    loc=ptr.loc;
    c=ptr.c;
}
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc))||[];
</script>
<span title={address}>
{#key $tosim}
<span class='clickable' on:click={click}>
{#each toctree as tocnode,idx}<span>{idx?PATHSEP:''}{_(tocnode.name)}</span>{/each}<span>{c&&showjuan?PATHSEP+c:''}{caption}</span></span>
{/key}</span>