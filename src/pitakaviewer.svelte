<script>
import { useBasket } from 'pitaka';
import {  setContext} from 'svelte';
import { renderer,searchbox } from './js/store.js';
import {setLoc} from './js/addresses.js'
import {scrollToHook} from './js/hook.js';
import VirtualScroll from './3rdparty/virtualscroll'
import ControlBar from './controlbar.svelte'
import { writable } from 'svelte/store';
import { parsePointer } from 'pitaka/offtext';
import {matchCriteria} from './js/criteria.js';
export let address='',tabid='';
export let visible=false;
// let toindex=0,systemsetting=false;
let vs,ptk='';
const viewstore=writable({criteria:{},partial:''});
setContext('viewstore',viewstore);
let {basket,loc,dy} =parsePointer(address);

$: ptk=useBasket(basket);
$: res = parsePointer(address) ; if (res) {basket=res.basket; loc=res.loc;}
$: vs&&dy&&vs.scrollToIndex(dy)

$:ptk&&visible?setLoc({ptk,loc},viewstore):setTimeout(()=>setLoc({ptk,loc},viewstore),1000);

$: items=matchCriteria($viewstore.items,$viewstore.criteria,$viewstore.partial)||[];

let scrollStart=0;
const scroll=(evt)=>{
    scrollStart=evt.detail.index;
}
const scrollTo=({detail})=>{
    if (detail.y) {
        const y=parseInt(detail.y);
        vs.scrollToIndex(y-$viewstore.y0);
    }
}
// $: items=$vline.items||[]; vs&&vs.scrollToOffset(0,items);
// $: vs&&vs.scrollToOffset(0,items.length)  //force scrolltotop when items changed
const setkeyword=({detail})=>{
    $viewstore.criteria={[detail.label]:detail.value};
}
</script>

<div class="container">
    <div><ControlBar {tabid} {scrollStart} {ptk} on:scrollTo={scrollTo}/></div>
    <svelte:component this={$searchbox[ptk.format]} {ptk}/>
    <VirtualScroll bind:this={vs} keeps={30} data={items} key="key" let:data on:scroll={scroll}>
        <svelte:component this={$renderer[ptk.format]||$renderer.default} 
            {loc} {ptk} {...data} on:setkeyword={setkeyword}/>
    </VirtualScroll>
</div>

<style>
    .container {overflow:hidden;height:100vh}
</style>