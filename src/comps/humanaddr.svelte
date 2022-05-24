<script>
import {useBasket, DEFAULT_LANGUAGE} from 'pitaka'
import {parseAddress} from 'pitaka/offtext';
import {_,tosim, palitrans} from '../js/store.js';
export let onclick=null;
export let caption='',showjuan=false, address='';
export let loc='', locOnly=false; //no pitaka name
export let c=''
export let ptk=null;
let lang='';
$: caption,c,showjuan,locOnly;
const click=(evt)=>{
    onclick&&onclick(evt)
}
let heading={};
$: if (address) {
    let basket='',ptr;
    ptr=parseAddress(address);
    basket=ptr.basket;
    ptk=useBasket(basket);

    if (ptr) loc=ptr.loc;    
    lang=ptk.header.lang||DEFAULT_LANGUAGE;
    heading=ptk.headingOf(loc);
}
</script>
<span title={address}>
<span class='clickable' on:click={click}>
<span title={_(lang,ptk.header.title,$tosim,$palitrans)}>{address.replace(/\/.+/,'')}</span>
</span>
</span>