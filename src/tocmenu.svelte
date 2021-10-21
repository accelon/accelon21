<script>
    export let scrollStart=0;
    import InputNumber from './comps/inputnumber.svelte';
    import {fade,fly,slide} from 'svelte/transition';
    let showing=true;
    let value=1;
</script>
<span class="hamburger" on:click={()=>showing=!showing}>☰</span>
{#if showing}
<div class="dropdownpanel">
Vol:<InputNumber bind:value max="55" min="1" />
Page:<InputNumber bind:value max="1000" min="1" />
</div>
{/if}