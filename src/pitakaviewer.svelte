<script>
import { useBasket } from 'pitaka';
import { onMount, tick , setContext} from 'svelte';
import { renderer,searchbox } from './js/store.js';
import {setLoc} from './js/addresses.js'
import {scrollToHook} from './js/hook.js';
import VirtualScroll from './3rdparty/virtualscroll'
import ControlBar from './controlbar.svelte'
import { writable,get } from 'svelte/store';
import { parsePointer } from 'pitaka/offtext';
export let address='',tabid='';

// let toindex=0,systemsetting=false;
let vs,ptk;
// $: vs&&vs.scrollToIndex(toindex)
let {basket,loc}=parsePointer(address);
$: res = parsePointer(address) ; if (res) {basket=res.basket; loc=res.loc;}
$: ptk=useBasket(basket);

const viewstore=writable({});

$:ptk&&setLoc({ptk,loc},viewstore);


$: items=$viewstore.items||[];
setContext('viewstore',viewstore);

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
    .container {overflow:hidden;height:calc(100vh)}
</style>