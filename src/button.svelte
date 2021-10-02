<script>
import Icons from './icons';
export let onclick;
export let icon;
export let disabled=false;
export let title='';
export let caption='';
export let leftcaption='';
const svg=Icons[icon];
const click=evt=>!disabled&&onclick(evt)
</script>
<span class:disabled class="button" title={title} on:click={click} >
    {#if leftcaption}<span>{leftcaption}</span>{/if}
    <span>{@html svg}</span>
    {#if caption}<span>{caption}</span>{/if}
</span>

<style>
    .button.button{ cursor:pointer;fill:var(--button-selected);padding-right:0.3em}
    .button.disabled {cursor:auto;fill:none;stroke:var(--button-unselected) }
    .button.disabled:hover {fill:none; stroke: var(--button-unselected)}
    .button:hover {color:var(--highlight); fill:var(--highlight);stroke:var(--highlight);}
</style>