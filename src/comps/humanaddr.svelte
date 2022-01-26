<script>
import {useBasket,PATHSEP, DEFAULT_LANGUAGE} from 'pitaka'
import {parseAddress} from 'pitaka/offtext';
import {_,tosim, palitrans} from '../js/store.js';
export let onclick=null;
export let caption='';
export let showjuan=false;
export let address='';
export let loc=''
export let locOnly=false; //no pitaka name
export let c=''
export let ptk=null;
let toctree='',lang='',script='';
$: langstyle='lang-'+lang+(lang==='pl'?'-'+($palitrans||''):'')
const click=(evt)=>{
    onclick(evt)
}
$: if (address) {
    let basket='',ptr;
    ptr=parseAddress(address);
    basket=ptr.basket;
    if (basket) {
        ptk=useBasket(basket);
        if (ptr) {
            loc=ptr.loc;
        }
        lang=ptk.header.lang||DEFAULT_LANGUAGE;
        script=lang==='pl'&&$palitrans;
    }
    toctree = (ptk&&ptk.getTocTree&&ptk.getTocTree(loc,locOnly))||[]; 
}
</script>
<span title={address}>
<span class='clickable' on:click={click}>
{#if toctree.length}
{#each toctree as tocnode,idx}<span class={langstyle}>{idx?PATHSEP:''}{_(tocnode.name,$tosim,idx&&script)}</span>{/each}<span>{c&&showjuan?PATHSEP+c:''}{_(caption,$tosim,script)}</span>
{:else}
{_(ptk,$tosim,script)}
{/if}
</span>
</span>