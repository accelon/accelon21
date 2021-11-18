<script>
import Icons from './icons.js';
export let onclick=null;
export let icon;
export let disabled=false;
export let title='';
export let caption='';
export let leftcaption='';
export let store=null;
const svg=Icons[icon]||'';
const click=evt=>{
    if(disabled)return;
    if (store) $store=!$store;
    evt.cancelBubble=true;
    return onclick&&onclick(evt);
}
</script>
<span class="button" class:disabled class:checked={store&&$store} class:unchecked={store && !$store} 
     title={title} on:click={click} >
    {#if leftcaption}<span>{leftcaption}</span>{/if}
    <span>{@html svg}</span>
    {#if caption}<span>{caption}</span>{/if}
</span>

<style>
    .button{ cursor:pointer;fill:var(--button-selected);padding-right:0.1em}
    .button.unchecked {
        color:var(--button-unselected);
		fill: var(--button-unselected) ;
		stroke: var(--button-unselected) ;
    }
    .button.checked {
        /* border-bottom: 3px solid var(--svg-highlight-stroke-color); */
		color:var(--highlight);
		fill: var(--highlight) ;
		stroke: var(--highlight) ;
    }
    
    .button.disabled { cursor:auto;fill:var(--button-disabled);stroke:var(--button-disabled) }
    .button.disabled:hover {fill:var(--button-disabled); stroke: var(--button-disabled)}
    .button:hover {color:var(--hover); fill:var(--hover);stroke:var(--hover);}
</style>