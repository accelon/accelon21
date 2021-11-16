<script>
import {useBasket,PATHSEP} from 'pitaka'
import {parsePointer} from 'pitaka/offtext';
import {_,tosim} from '../js/store.js';
export let onclick=null;
export let caption='';

export let address='';
const click=(evt)=>{
    onclick(evt)
}
const {basket,loc,c}=parsePointer(address);
const ptk=useBasket(basket);
$: toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc))||[];
</script>
<span title={address}>
{#key $tosim}
<span class='clickable' on:click={click}>
{#each toctree as tocnode,idx}<span>{idx?PATHSEP:''}{_(tocnode.name)}</span>{/each}<span>{c?PATHSEP+c:''}{caption}</span></span>
{/key}</span>