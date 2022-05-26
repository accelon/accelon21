<script>
export let scrollStart=0;
export let showing=true; //0 = off , 1=on 
$: scrollStart;

</script>
<span class="hamburger" class:showing on:click={()=>showing=!showing}>☰</span>
{#if showing}
<div class="dropdownpanel">
   <slot></slot>
</div>
{/if}
<style>
    :global(.showing) {color:var(--highlight)}
</style>