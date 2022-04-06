<script>
    export let scrollStart=0;
    export let showmode=1; //0 = always off , 1=auto on , 2=always on
    const AUTOMENULINE=5;
    const setshowmode=evt=>{
        if (showing) {
            if (scrollStart<AUTOMENULINE) showmode=0;//user want to turn off
            else showmode=1;               //auto off
        } else {
            showmode=2; 
        }
    }
$: showing = (scrollStart<AUTOMENULINE && showmode==1) || showmode==2;
</script>
<span class="hamburger" class:showing on:click={setshowmode}>☰</span>
{#if showing}
<div class="dropdownpanel">
   <slot></slot>
</div>
{/if}
<style>
    :global(.showing) {color:var(--highlight)}
</style>