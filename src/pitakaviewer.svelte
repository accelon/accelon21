<script>
import { useBasket } from 'pitaka';
import { onMount, setContext} from 'svelte';
import { renderer,searchbox } from './js/store.js';
import {setLoc} from './js/addresses.js'
import {scrollToHook} from './js/hook.js';
import VirtualScroll from './3rdparty/virtualscroll'
import ControlBar from './controlbar.svelte'
import { writable,get } from 'svelte/store';
import { parsePointer } from 'pitaka/offtext';
export let address='',tabid='';
export let visible=false;
// let toindex=0,systemsetting=false;
let vs,ptk='';
const viewstore=writable({});
setContext('viewstore',viewstore);
// $: vs&&vs.scrollToIndex(toindex)
let {basket,loc} =parsePointer(address);
$: ptk=useBasket(basket);
$: res = parsePointer(address) ; if (res) {basket=res.basket; loc=res.loc;}

$:ptk&&visible?setLoc({ptk,loc},viewstore):setTimeout(()=>setLoc({ptk,loc},viewstore),1000);


$: items=$viewstore.items||[];


// $: items=$vline.items||[]; vs&&vs.scrollToOffset(0,items);
// $: vs&&vs.scrollToOffset(0,items.length)  //force scrolltotop when items changed

</script>

<div class="container">
    <div><ControlBar {tabid}/></div>
    <svelte:component this={$searchbox[ptk.format]} {ptk}/>
    <VirtualScroll bind:this={vs} keeps={30} data={items} key="key" let:data>
        <svelte:component this={$renderer[ptk.format]||$renderer.default} {loc} {ptk} {...data}/>
    </VirtualScroll>
</div>

<style>
    .container {overflow:hidden;height:100vh}
</style>