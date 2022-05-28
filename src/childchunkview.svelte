<script>
import {_,tosim,palitrans} from './js/store.js'
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
import Button from './comps/button.svelte'
import InputNumber from './comps/inputnumber.svelte'
export let items=[];
export let lang;
let selected=1;
const prev=()=>{
	if (selected>1) selected--;
}
const next=()=>{
	if (selected<items.length) selected++;
}
const updatevalue=({detail})=>{
	selected=detail;
}
const openchunk=()=>{
	dispatch('go', items[selected-1].y0);
}
</script>
<InputNumber value={selected} min=1 max={items.length} on:change={updatevalue} on:enter={openchunk}/>
<span class="clickable" on:click={openchunk}>{_(lang,items[selected-1].text,$tosim,$palitrans,30)}</span>
